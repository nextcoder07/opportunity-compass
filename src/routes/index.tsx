import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Banknote, BookOpen, Briefcase, FileText, GraduationCap, Landmark, Map, Sparkles, Trophy, Bell, Bookmark, ShieldCheck, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Landing,
  head: () => ({
    meta: [
      { title: "OpportunityHub — Every opportunity, every student" },
      { name: "description", content: "India's all-in-one student opportunity platform: scholarships, government schemes, loans, internships, competitions, courses and career roadmaps." },
      { property: "og:title", content: "OpportunityHub — Every opportunity, every student" },
      { property: "og:description", content: "Personalized scholarships, internships and career roadmaps for Indian students." },
    ],
  }),
});

const CATEGORIES = [
  { i: GraduationCap, l: "Scholarships", d: "Merit & need based" },
  { i: Landmark, l: "Govt Schemes", d: "Central & state" },
  { i: Banknote, l: "Loans", d: "Education finance" },
  { i: Briefcase, l: "Internships", d: "Real experience" },
  { i: Trophy, l: "Competitions", d: "Hackathons & more" },
  { i: BookOpen, l: "Courses", d: "Free & certified" },
  { i: Map, l: "Careers", d: "Step-by-step roadmaps" },
  { i: FileText, l: "Blog", d: "Guides & insights" },
];

const FEATURES = [
  { i: Sparkles, t: "Personalized For You feed", d: "Smart matches ranked to your profile, stream, state and interests." },
  { i: Bell, t: "Deadline reminders", d: "Never miss a scholarship or internship deadline again." },
  { i: Bookmark, t: "Save & track applications", d: "Bookmark opportunities and track applications in one place." },
  { i: FileText, t: "60MB document vault", d: "Store certificates and marksheets securely for one-click applies." },
  { i: ShieldCheck, t: "Verified sources", d: "Hand-curated information from official portals you can trust." },
  { i: Zap, t: "Career roadmaps", d: "Visual roadmaps from Class 9 to your dream job." },
];

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center md:pt-20">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-primary" /> Built for Indian students
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
          Every opportunity. <span className="text-primary">Every student.</span> One platform.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          Personalized scholarships, government schemes, education loans, internships, competitions, courses and career roadmaps — tailored to your profile, in one place.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg"><Link to="/auth">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/auth">I have an account</Link></Button>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight md:text-3xl">Everything a student needs</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map(({ i: I, l, d }) => (
            <div key={l} className="rounded-xl border bg-card p-4 transition hover:shadow-md">
              <I className="mb-2 h-5 w-5 text-primary" />
              <div className="text-sm font-semibold">{l}</div>
              <div className="text-xs text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="border-y bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight md:text-3xl">Built like your personal opportunity OS</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">Not another directory. A focused workspace that understands you and surfaces what matters.</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ i: I, t, d }) => (
              <div key={t} className="rounded-xl border bg-background p-5">
                <span className="mb-3 inline-grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><I className="h-5 w-5" /></span>
                <div className="font-semibold">{t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight md:text-3xl">How it works</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { n: 1, t: "Create your profile", d: "Education, state, stream and interests — under 2 minutes." },
            { n: 2, t: "Get matched", d: "We rank opportunities by your eligibility and goals." },
            { n: 3, t: "Apply & track", d: "Save, get reminders, and track every application." },
          ].map((s) => (
            <li key={s.n} className="rounded-xl border bg-card p-5">
              <div className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-bold">{s.n}</div>
              <div className="font-semibold">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl">Frequently asked</h2>
        <div className="space-y-3">
          {[
            { q: "Is OpportunityHub free?", a: "Yes. Core features are free forever for students." },
            { q: "Which students is it for?", a: "Indian students from Class 9 onwards — school, college, postgrad and early-career." },
            { q: "How are opportunities verified?", a: "Information is curated from official portals and reviewed by our team." },
            { q: "Can I store my documents?", a: "Yes — up to 60MB in a secure vault for one-click applications." },
          ].map((f) => (
            <details key={f.q} className="group rounded-xl border bg-card p-4">
              <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-16 max-w-5xl px-4">
        <div className="rounded-2xl border bg-gradient-to-br from-primary to-primary/70 p-8 text-center text-primary-foreground md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Your next opportunity is one click away.</h2>
          <p className="mx-auto mt-2 max-w-xl opacity-90">Join thousands of students finding scholarships, internships and roadmaps tailored to them.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/auth">Create your free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
