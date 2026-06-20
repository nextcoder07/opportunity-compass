import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const EDUCATION = ["Class 9-10","Class 11-12 Science","Class 11-12 Commerce","Class 11-12 Arts","Diploma","ITI","Undergraduate","Postgraduate","Fresh Graduate"];
const STATES = ["All India","Andhra Pradesh","Bihar","Delhi","Gujarat","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"];
const CATEGORIES = ["General","OBC","SC","ST","EWS","Minority"];
const GENDERS = ["Male","Female","Other"];
const INCOMES = ["<2L","2-5L","5-8L","8L+"];
const INTERESTS = ["AI","Software Development","Data Science","Civil Services","Medicine","Law","Design","Business","Research","Entrepreneurship","Finance","Engineering"];

export const Route = createFileRoute("/_authenticated/profile")({ component: Page });

function Page() {
  const { profile, refreshProfile, user } = useAuth();
  const [form, setForm] = useState(profile || ({} as Record<string, unknown>));
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (profile) setForm(profile); }, [profile]);
  const setF = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggleI = (i: string) => {
    const cur: string[] = (form.career_interests as string[]) || [];
    setF("career_interests", cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]);
  };
  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = form as Record<string, unknown>;
    void id; void created_at; void updated_at;
    const { error } = await supabase.from("profiles").update({ ...rest, onboarded: true }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    refreshProfile();
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Your profile</h1>
        <p className="text-sm text-muted-foreground">We use this to personalize every recommendation.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Basic</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div><Label>Full name</Label><Input value={(form.full_name as string) || ""} onChange={(e) => setF("full_name", e.target.value)} /></div>
          <div><Label>Education level</Label>
            <Select value={(form.education_level as string) || ""} onValueChange={(v) => setF("education_level", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{EDUCATION.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label>Degree</Label><Input value={(form.degree as string) || ""} onChange={(e) => setF("degree", e.target.value)} /></div>
          <div><Label>Stream</Label><Input value={(form.stream as string) || ""} onChange={(e) => setF("stream", e.target.value)} /></div>
          <div><Label>Branch</Label><Input value={(form.branch as string) || ""} onChange={(e) => setF("branch", e.target.value)} /></div>
          <div><Label>Year / Semester</Label><Input value={(form.year_or_semester as string) || ""} onChange={(e) => setF("year_or_semester", e.target.value)} /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Location & Personal</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div><Label>State</Label>
            <Select value={(form.state as string) || ""} onValueChange={(v) => setF("state", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label>District</Label><Input value={(form.district as string) || ""} onChange={(e) => setF("district", e.target.value)} /></div>
          <div><Label>Gender</Label>
            <Select value={(form.gender as string) || ""} onValueChange={(v) => setF("gender", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label>Category</Label>
            <Select value={(form.category as string) || ""} onValueChange={(v) => setF("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label>Family income</Label>
            <Select value={(form.income_range as string) || ""} onValueChange={(v) => setF("income_range", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{INCOMES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Career interests</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => {
              const active = ((form.career_interests as string[]) || []).includes(i);
              return <Badge key={i} variant={active ? "default" : "outline"} className="cursor-pointer px-3 py-1.5 text-sm" onClick={() => toggleI(i)}>{i}</Badge>;
            })}
          </div>
        </CardContent>
      </Card>
      <Button onClick={save} disabled={saving} className="w-full md:w-auto">{saving ? "Saving…" : "Save changes"}</Button>
    </div>
  );
}
