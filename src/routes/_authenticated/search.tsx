import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/search")({ component: Page });

const SOURCES = [
  { table: "scholarships", label: "Scholarships", col: "name" },
  { table: "schemes", label: "Schemes", col: "name" },
  { table: "loans", label: "Loans", col: "name" },
  { table: "internships", label: "Internships", col: "title" },
  { table: "competitions", label: "Competitions", col: "name" },
  { table: "courses", label: "Courses", col: "name" },
  { table: "careers", label: "Careers", col: "name" },
  { table: "blogs", label: "Blogs", col: "title" },
] as const;

function Page() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Record<string, Array<Record<string, unknown>>>>({});
  useEffect(() => {
    if (q.length < 2) { setResults({}); return; }
    const t = setTimeout(async () => {
      const out: Record<string, Array<Record<string, unknown>>> = {};
      await Promise.all(SOURCES.map(async (s) => {
        const { data } = await supabase.from(s.table).select("*").ilike(s.col, `%${q}%`).limit(5);
        out[s.label] = (data as Array<Record<string, unknown>>) || [];
      }));
      setResults(out);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">Find anything across OpportunityHub.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type at least 2 characters…" className="pl-9" />
      </div>
      {SOURCES.map((s) => {
        const r = results[s.label] || [];
        if (!r.length) return null;
        return (
          <section key={s.label}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</h2>
            <div className="space-y-2">
              {r.map((row) => (
                <Card key={row.id as string}><CardContent className="p-3 text-sm">{row[s.col] as string}</CardContent></Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
