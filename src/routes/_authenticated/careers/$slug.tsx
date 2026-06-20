import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Briefcase, GraduationCap, IndianRupee, Sparkles, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/careers/$slug")({ component: Page });

type Career = {
  id: string; slug: string; name: string; overview: string | null;
  academic_path: string | null; entrance_exams: string[] | null; skills: string[] | null;
  future_scope: string | null; ai_impact: string | null; salary_range: string | null;
  top_recruiters: string[] | null; roadmap: { step: string }[] | null;
};

function Page() {
  const { slug } = Route.useParams();
  const [c, setC] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("careers").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      setC(data as Career | null); setLoading(false);
    });
  }, [slug]);
  if (loading) return <div className="grid h-64 place-items-center text-sm text-muted-foreground">Loading…</div>;
  if (!c) throw notFound();
  return (
    <div className="space-y-6">
      <Link to="/careers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" />Back to careers</Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{c.name}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{c.overview}</p>
      </div>

      {c.roadmap && c.roadmap.length > 0 && (
        <Card><CardContent className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Target className="h-4 w-4 text-primary" />Roadmap</h2>
          <ol className="relative space-y-3 border-l-2 border-primary/30 pl-6">
            {c.roadmap.map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                <div className="rounded-lg border bg-card px-3 py-2 text-sm">{s.step}</div>
              </li>
            ))}
          </ol>
        </CardContent></Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Info icon={GraduationCap} title="Academic Path" value={c.academic_path} />
        <ListCard icon={Briefcase} title="Entrance Exams" items={c.entrance_exams} />
        <ListCard icon={Sparkles} title="Required Skills" items={c.skills} />
        <ListCard icon={TrendingUp} title="Top Recruiters" items={c.top_recruiters} />
        <Info icon={IndianRupee} title="Salary Range" value={c.salary_range} />
        <Info icon={TrendingUp} title="Future Scope" value={c.future_scope} />
        <Info icon={Sparkles} title="AI Impact" value={c.ai_impact} />
      </div>
    </div>
  );
}

function Info({ icon: Icon, title, value }: { icon: typeof Briefcase; title: string; value: string | null }) {
  if (!value) return null;
  return <Card><CardContent className="p-5">
    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4 text-primary" />{title}</h3>
    <p className="text-sm text-muted-foreground">{value}</p>
  </CardContent></Card>;
}
function ListCard({ icon: Icon, title, items }: { icon: typeof Briefcase; title: string; items: string[] | null }) {
  if (!items?.length) return null;
  return <Card><CardContent className="p-5">
    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Icon className="h-4 w-4 text-primary" />{title}</h3>
    <div className="flex flex-wrap gap-1">{items.map((x) => <Badge key={x} variant="secondary">{x}</Badge>)}</div>
  </CardContent></Card>;
}
