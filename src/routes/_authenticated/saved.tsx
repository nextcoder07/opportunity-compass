import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/saved")({ component: Page });

const TYPES = [
  { type: "scholarship", table: "scholarships", label: "Scholarships", title: "name" },
  { type: "scheme", table: "schemes", label: "Schemes", title: "name" },
  { type: "loan", table: "loans", label: "Loans", title: "name" },
  { type: "internship", table: "internships", label: "Internships", title: "title" },
  { type: "competition", table: "competitions", label: "Competitions", title: "name" },
  { type: "course", table: "courses", label: "Courses", title: "name" },
  { type: "career", table: "careers", label: "Careers", title: "name" },
  { type: "blog", table: "blogs", label: "Blogs", title: "title" },
] as const;

function Page() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, Array<Record<string, unknown>>>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: saved } = await supabase.from("saved_items").select("*").eq("user_id", user.id);
      const grouped: Record<string, string[]> = {};
      (saved || []).forEach((s) => { (grouped[s.item_type] ||= []).push(s.item_id); });
      const result: Record<string, Array<Record<string, unknown>>> = {};
      await Promise.all(
        TYPES.map(async (t) => {
          const ids = grouped[t.type] || [];
          if (!ids.length) { result[t.type] = []; return; }
          const { data: rows } = await supabase.from(t.table).select("*").in("id", ids);
          result[t.type] = (rows as Array<Record<string, unknown>>) || [];
        }),
      );
      setData(result);
    })();
  }, [user]);

  const total = Object.values(data).reduce((s, x) => s + x.length, 0);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Saved</h1>
        <p className="text-sm text-muted-foreground">{total} item{total === 1 ? "" : "s"} saved across categories.</p>
      </div>
      <Tabs defaultValue="scholarship">
        <TabsList className="flex w-full flex-wrap gap-1">
          {TYPES.map((t) => <TabsTrigger key={t.type} value={t.type}>{t.label} ({data[t.type]?.length ?? 0})</TabsTrigger>)}
        </TabsList>
        {TYPES.map((t) => (
          <TabsContent key={t.type} value={t.type} className="mt-4">
            {!data[t.type] ? <p className="text-sm text-muted-foreground">Loading…</p>
              : data[t.type].length === 0 ? (
                <Card><CardContent className="grid place-items-center p-10 text-center">
                  <Bookmark className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm">Nothing saved yet.</p>
                  <Button asChild variant="link"><Link to="/suggestions">Browse opportunities</Link></Button>
                </CardContent></Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {data[t.type].map((r) => (
                    <Card key={r.id as string}><CardContent className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">{(r[t.title] as string) || "Untitled"}</h3>
                      {(r.url || r.apply_url || r.official_url) && (
                        <a href={(r.url || r.apply_url || r.official_url) as string} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary">Open <ExternalLink className="h-3 w-3" /></a>
                      )}
                    </CardContent></Card>
                  ))}
                </div>
              )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
