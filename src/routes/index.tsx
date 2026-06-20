import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, GraduationCap, Briefcase, Trophy, BookOpen, FileText, Map, ArrowRight } from "lucide-react";

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

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          OpportunityHub
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
          <Button asChild><Link to="/auth">Get started</Link></Button>
        </div>
      </header>

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

      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 pb-20 md:grid-cols-3 lg:grid-cols-6">
        {[
          { i: GraduationCap, l: "Scholarships" },
          { i: Sparkles, l: "Schemes" },
          { i: Briefcase, l: "Internships" },
          { i: Trophy, l: "Competitions" },
          { i: BookOpen, l: "Courses" },
          { i: Map, l: "Careers" },
        ].map(({ i: I, l }) => (
          <div key={l} className="rounded-xl border bg-card p-4 text-center">
            <I className="mx-auto mb-2 h-5 w-5 text-primary" />
            <div className="text-sm font-medium">{l}</div>
          </div>
        ))}
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OpportunityHub
      </footer>
    </div>
  );
}
