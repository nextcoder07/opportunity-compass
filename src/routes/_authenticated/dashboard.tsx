import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Trophy, Calendar, FileText, Map, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function Dashboard() {
  const { profile, user } = useAuth();
  const [counts, setCounts] = useState({ scholarships: 0, internships: 0, competitions: 0, upcoming: 0 });
  useEffect(() => {
    if (!user) return;
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
      const [s, i, c, sched] = await Promise.all([
        supabase.from("scholarships").select("*", { count: "exact", head: true }),
        supabase.from("internships").select("*", { count: "exact", head: true }),
        supabase.from("competitions").select("*", { count: "exact", head: true }),
        supabase.from("scholarships").select("*", { count: "exact", head: true }).gte("deadline", today).lte("deadline", in30),
      ]);
      setCounts({ scholarships: s.count || 0, internships: i.count || 0, competitions: c.count || 0, upcoming: sched.count || 0 });
    })();
  }, [user]);

  const name = profile?.full_name?.split(" ")[0] || "Student";
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Welcome back, {name} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening across your opportunities.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={GraduationCap} label="Scholarships" value={counts.scholarships} to="/scholarships" />
        <Stat icon={Briefcase} label="Internships" value={counts.internships} to="/internships" />
        <Stat icon={Trophy} label="Competitions" value={counts.competitions} to="/competitions" />
        <Stat icon={Calendar} label="Deadlines (30d)" value={counts.upcoming} to="/suggestions" accent />
      </div>

      <Card className="bg-gradient-to-br from-primary/10 via-accent/30 to-background">
        <CardContent className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center">
          <Sparkles className="h-10 w-10 text-primary" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Your personalized recommendations are ready</h2>
            <p className="text-sm text-muted-foreground">Tailored to your profile — education, state, category and interests.</p>
          </div>
          <Button asChild><Link to="/suggestions">See suggestions <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Quick to="/scholarships" icon={GraduationCap} label="Find Scholarships" />
          <Quick to="/internships" icon={Briefcase} label="Explore Internships" />
          <Quick to="/competitions" icon={Trophy} label="Browse Competitions" />
          <Quick to="/careers" icon={Map} label="Career Roadmaps" />
          <Quick to="/documents" icon={FileText} label="Document Vault" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, to, accent }: { icon: typeof GraduationCap; label: string; value: number; to: string; accent?: boolean }) {
  return (
    <Link to={to}>
      <Card className="transition hover:-translate-y-0.5 hover:shadow-md"><CardContent className="flex items-center gap-3 p-4">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${accent ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-xl font-bold leading-none">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent></Card>
    </Link>
  );
}
function Quick({ to, icon: Icon, label }: { to: string; icon: typeof GraduationCap; label: string }) {
  return (
    <Link to={to}>
      <Card className="transition hover:-translate-y-0.5 hover:shadow-md"><CardContent className="flex items-center gap-3 p-4">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </CardContent></Card>
    </Link>
  );
}
