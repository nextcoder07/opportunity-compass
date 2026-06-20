import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/careers")({ component: Page });

type Career = { id: string; slug: string; name: string; overview: string | null; salary_range: string | null; tags: string[] | null };

function Page() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    supabase.from("careers").select("id, slug, name, overview, salary_range, tags").then(({ data }) => setCareers((data as Career[]) || []));
  }, []);
  const filtered = careers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Career Roadmaps</h1>
        <p className="text-sm text-muted-foreground">Visual roadmaps from where you are today to your dream career.</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search careers…" className="pl-9" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link key={c.id} to="/careers/$slug" params={{ slug: c.slug }}>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{c.name}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.overview}</p>
                {c.salary_range && <p className="mt-3 text-xs font-medium text-primary">{c.salary_range}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
