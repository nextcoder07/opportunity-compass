import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/documents")({ component: Page });

const CATS = ["Identity","Academic","Financial","Resume","Other"];
const QUOTA = 60 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png";

type Doc = { id: string; name: string; category: string; storage_path: string; mime_type: string | null; size_bytes: number; created_at: string };

function Page() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const used = docs.reduce((s, d) => s + d.size_bytes, 0);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    setDocs((data as Doc[]) || []);
  };
  useEffect(() => { load(); }, [user]); // eslint-disable-line

  const upload = async (f: File) => {
    if (!user) return;
    if (used + f.size > QUOTA) return toast.error("Storage limit (60 MB) exceeded");
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${f.name}`;
    const { error: upErr } = await supabase.storage.from("documents").upload(path, f);
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { error } = await supabase.from("documents").insert({
      user_id: user.id, name: f.name, category: "Other", storage_path: path, mime_type: f.type, size_bytes: f.size,
    });
    setUploading(false);
    if (error) {
      await supabase.storage.from("documents").remove([path]);
      return toast.error(error.message);
    }
    toast.success("Uploaded");
    load();
  };

  const download = async (d: Doc) => {
    const { data } = await supabase.storage.from("documents").createSignedUrl(d.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };
  const remove = async (d: Doc) => {
    if (!confirm(`Delete ${d.name}?`)) return;
    await supabase.storage.from("documents").remove([d.storage_path]);
    await supabase.from("documents").delete().eq("id", d.id);
    toast.success("Deleted");
    load();
  };
  const rename = async (d: Doc) => {
    const next = prompt("Rename to", d.name);
    if (!next || next === d.name) return;
    await supabase.from("documents").update({ name: next }).eq("id", d.id);
    load();
  };
  const setCategory = async (d: Doc, c: string) => {
    await supabase.from("documents").update({ category: c }).eq("id", d.id);
    load();
  };

  const filtered = docs.filter((d) => (cat === "All" || d.category === cat) && d.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Document vault</h1>
        <p className="text-sm text-muted-foreground">Store certificates, marksheets, ID proofs and your resume securely.</p>
      </div>
      <Card><CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{(used / 1024 / 1024).toFixed(1)} MB / 60 MB used</span>
          <span className="text-xs text-muted-foreground">{Math.round((used / QUOTA) * 100)}%</span>
        </div>
        <Progress value={(used / QUOTA) * 100} />
        <div className="flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}><Upload className="mr-2 h-4 w-4" />{uploading ? "Uploading…" : "Upload document"}</Button>
          <span className="text-xs text-muted-foreground">PDF, JPG, PNG · max 60 MB total</span>
        </div>
      </CardContent></Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="pl-9" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{["All", ...CATS].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="grid place-items-center p-10 text-center text-sm text-muted-foreground">
          <FileText className="mb-2 h-8 w-8" />No documents yet.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id}><CardContent className="space-y-2 p-4">
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-5 w-5 text-primary" />
                <button className="flex-1 text-left text-sm font-medium leading-snug hover:underline" onClick={() => rename(d)}>{d.name}</button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Select value={d.category} onValueChange={(v) => setCategory(d, v)}>
                  <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <span>{(d.size_bytes / 1024).toFixed(0)} KB</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => download(d)}><Download className="mr-1 h-3 w-3" />Open</Button>
                <Button size="sm" variant="outline" onClick={() => remove(d)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
