import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({ component: Page });

const TABLES = ["scholarships","schemes","loans","internships","competitions","courses","careers","blogs"] as const;

function Page() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="grid h-64 place-items-center text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) throw redirect({ to: "/dashboard" });
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
      </div>
      <Stats />
      <Tabs defaultValue="content">
        <TabsList><TabsTrigger value="content">Content</TabsTrigger><TabsTrigger value="broadcast">Broadcast</TabsTrigger></TabsList>
        <TabsContent value="content" className="mt-4"><ContentManager /></TabsContent>
        <TabsContent value="broadcast" className="mt-4"><Broadcast /></TabsContent>
      </Tabs>
    </div>
  );
}

function Stats() {
  const [stats, setStats] = useState<Record<string, number>>({});
  useEffect(() => {
    (async () => {
      const out: Record<string, number> = {};
      await Promise.all([...TABLES, "profiles" as const].map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        out[t] = count || 0;
      }));
      setStats(out);
    })();
  }, []);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Object.entries(stats).map(([k, v]) => (
        <Card key={k}><CardContent className="p-4"><div className="text-2xl font-bold">{v}</div><div className="text-xs capitalize text-muted-foreground">{k}</div></CardContent></Card>
      ))}
    </div>
  );
}

function ContentManager() {
  const [table, setTable] = useState<(typeof TABLES)[number]>("scholarships");
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [name, setName] = useState("");
  const load = async () => {
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(50);
    setRows((data as Array<Record<string, unknown>>) || []);
  };
  useEffect(() => { load(); }, [table]); // eslint-disable-line
  const titleCol = table === "internships" || table === "blogs" ? "title" : "name";
  const add = async () => {
    if (!name) return;
    const insert: Record<string, unknown> = { [titleCol]: name };
    if (table === "blogs" || table === "careers") insert.slug = name.toLowerCase().replace(/\s+/g, "-").slice(0, 60);
    const { error } = await supabase.from(table).insert(insert);
    if (error) return toast.error(error.message);
    setName("");
    toast.success("Added");
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {TABLES.map((t) => <Button key={t} size="sm" variant={t === table ? "default" : "outline"} onClick={() => setTable(t)}>{t}</Button>)}
      </div>
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={`Quick add ${titleCol}…`} />
        <Button onClick={add}><Plus className="mr-1 h-4 w-4" />Add</Button>
      </div>
      <Card><CardContent className="p-0">
        <ul className="divide-y">
          {rows.map((r) => (
            <li key={r.id as string} className="flex items-center justify-between gap-3 p-3 text-sm">
              <span className="truncate">{r[titleCol] as string}</span>
              <Button size="sm" variant="ghost" onClick={() => del(r.id as string)}><Trash2 className="h-3 w-3" /></Button>
            </li>
          ))}
          {rows.length === 0 && <li className="p-4 text-center text-xs text-muted-foreground">Empty</li>}
        </ul>
      </CardContent></Card>
      <p className="text-xs text-muted-foreground">Tip: use the database tools for full editing. Quick add lets you scaffold entries fast.</p>
    </div>
  );
}

function Broadcast() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!title) return toast.error("Title is required");
    setBusy(true);
    const { data: users } = await supabase.from("profiles").select("id");
    if (!users) { setBusy(false); return; }
    const rows = users.map((u) => ({ user_id: u.id, title, body, kind: "broadcast" }));
    const { error } = await supabase.from("notifications").insert(rows);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Sent to ${users.length} users`);
    setTitle(""); setBody("");
  };
  return (
    <Card><CardContent className="space-y-3 p-5">
      <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} /></div>
      <Button onClick={send} disabled={busy}><Send className="mr-2 h-4 w-4" />{busy ? "Sending…" : "Send to all users"}</Button>
    </CardContent></Card>
  );
}
