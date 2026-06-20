import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EDUCATION = ["Class 9-10","Class 11-12 Science","Class 11-12 Commerce","Class 11-12 Arts","Diploma","ITI","Undergraduate","Postgraduate","Fresh Graduate"];
const STATES = ["All India","Andhra Pradesh","Bihar","Delhi","Gujarat","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"];
const CATEGORIES = ["General","OBC","SC","ST","EWS","Minority"];
const GENDERS = ["Male","Female","Other"];
const INCOMES = ["<2L","2-5L","5-8L","8L+"];
const INTERESTS = ["AI","Software Development","Data Science","Civil Services","Medicine","Law","Design","Business","Research","Entrepreneurship","Finance","Engineering"];

export function OnboardingDialog({ open, onDone }: { open: boolean; onDone: () => void }) {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    education_level: "", degree: "", stream: "", branch: "", year_or_semester: "",
    state: "", district: "", gender: "", category: "", income_range: "",
    career_interests: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form, v: string | string[]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (i: string) =>
    set("career_interests", form.career_interests.includes(i) ? form.career_interests.filter((x) => x !== i) : [...form.career_interests, i]);

  const submit = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ ...form, onboarded: true }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success("Profile saved!");
    onDone();
  };

  const steps = [
    {
      title: "Education",
      content: (
        <div className="space-y-3">
          <div><Label>Education level</Label>
            <Select value={form.education_level} onValueChange={(v) => set("education_level", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{EDUCATION.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Degree</Label><Input value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="e.g. BTech" /></div>
            <div><Label>Stream</Label><Input value={form.stream} onChange={(e) => set("stream", e.target.value)} placeholder="e.g. Engineering" /></div>
            <div><Label>Branch</Label><Input value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="e.g. CSE" /></div>
            <div><Label>Year / Semester</Label><Input value={form.year_or_semester} onChange={(e) => set("year_or_semester", e.target.value)} placeholder="e.g. 2nd Year" /></div>
          </div>
        </div>
      ),
    },
    {
      title: "Location & Personal",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>State</Label>
              <Select value={form.state} onValueChange={(v) => set("state", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            <div><Label>District</Label><Input value={form.district} onChange={(e) => set("district", e.target.value)} /></div>
            <div><Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
          </div>
          <div><Label>Family Income</Label>
            <Select value={form.income_range} onValueChange={(v) => set("income_range", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{INCOMES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select></div>
        </div>
      ),
    },
    {
      title: "Career Interests",
      content: (
        <div>
          <Label>Pick all that apply</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTERESTS.map((i) => {
              const active = form.career_interests.includes(i);
              return (
                <Badge key={i} variant={active ? "default" : "outline"} onClick={() => toggleInterest(i)} className="cursor-pointer select-none px-3 py-1.5 text-sm">
                  {i}
                </Badge>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" hideCloseButton>
        <DialogHeader>
          <DialogTitle>Welcome to OpportunityHub 🎉</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {steps.length} — {steps[step].title}. We use this to personalize your opportunities.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">{steps[step].content}</div>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
          {step < steps.length - 1
            ? <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            : <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Finish"}</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
