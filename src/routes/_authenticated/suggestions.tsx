import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { matchScore } from "@/lib/match-score";
import { OpportunityCard, CardSkeleton, type CardItem } from "@/components/OpportunityCard";
import { useSavedSet } from "@/lib/use-saved";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/suggestions")({ component: Page });

type Section = { title: string; items: (CardItem & { _type: string })[] };

function Page() {
  const { profile } = useAuth();
  const [sections, setSections] = useState<Section[] | null>(null);
  const allItemTypes = ["scholarship", "internship", "competition", "course", "scheme", "loan"];
  const savedHooks = allItemTypes.map((t) => useSavedSet(t)); // eslint-disable-line react-hooks/rules-of-hooks

  useEffect(() => {
    (async () => {
      const [sch, ints, comp, crs, schm, lns] = await Promise.all([
        supabase.from("scholarships").select("*").limit(12),
        supabase.from("internships").select("*").limit(12),
        supabase.from("competitions").select("*").limit(12),
        supabase.from("courses").select("*").limit(12),
        supabase.from("schemes").select("*").limit(12),
        supabase.from("loans").select("*").limit(12),
      ]);
      const wrap = <T extends { id: string }>(rows: T[] | null, type: string, mapper: (r: T) => CardItem, scoring: (r: T) => Parameters<typeof matchScore>[1]) =>
        (rows || []).map((r) => {
          const { score, reasons } = matchScore(profile, scoring(r));
          return { ...mapper(r), _type: type, matchScore: score, matchReasons: reasons };
        }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)).slice(0, 6);

      setSections([
        { title: "Recommended Scholarships", items: wrap(sch.data, "scholarship",
          (r) => ({ id: r.id, title: r.name, subtitle: r.provider, description: r.description, amount: r.amount, deadline: r.deadline, url: r.apply_url, location: r.state, tags: r.tags }),
          (r) => ({ education_levels: r.education_levels, state: r.state, categories: r.categories, income_max: r.income_max, gender: r.gender, fields: r.fields, tags: r.tags })) },
        { title: "Recommended Internships", items: wrap(ints.data, "internship",
          (r) => ({ id: r.id, title: r.title, subtitle: r.company, amount: r.stipend, deadline: r.deadline, location: r.location, url: r.apply_url, tags: [r.mode, r.duration].filter(Boolean) as string[] }),
          (r) => ({ domain: r.domain, tags: r.tags })) },
        { title: "Recommended Competitions", items: wrap(comp.data, "competition",
          (r) => ({ id: r.id, title: r.name, subtitle: r.organizer, amount: r.prize, deadline: r.deadline, url: r.apply_url, tags: [r.category, r.mode].filter(Boolean) as string[] }),
          (r) => ({ education_levels: r.education_level ? [r.education_level] : null, domain: r.domain, tags: r.tags })) },
        { title: "Recommended Courses", items: wrap(crs.data, "course",
          (r) => ({ id: r.id, title: r.name, subtitle: r.provider, description: r.description, amount: r.duration, url: r.url, tags: [r.free ? "Free" : "Paid", r.certification ? "Certificate" : null].filter(Boolean) as string[] }),
          (r) => ({ subject: r.subject, tags: r.tags })) },
        { title: "Recommended Schemes", items: wrap(schm.data, "scheme",
          (r) => ({ id: r.id, title: r.name, subtitle: r.provider, description: r.benefits, url: r.official_url, location: r.state, tags: r.tags }),
          (r) => ({ state: r.state, categories: r.categories, gender: r.gender, tags: r.tags })) },
        { title: "Recommended Loans", items: wrap(lns.data, "loan",
          (r) => ({ id: r.id, title: r.name, subtitle: r.bank, amount: `${r.max_amount} · ${r.interest_rate}`, url: r.apply_url, tags: [r.bank_type].filter(Boolean) as string[] }),
          () => ({})) },
      ]);
    })();
  }, [profile]);

  const profileBadge = useMemo(() =>
    profile ? [profile.education_level, profile.state, profile.category, profile.income_range].filter(Boolean).join(" · ") : "",
    [profile]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">For You</h1>
          <p className="text-sm text-muted-foreground">Personalized across every category in OpportunityHub.</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link to="/profile"><Settings2 className="mr-2 h-4 w-4" />Edit profile / filters</Link></Button>
      </div>
      {profileBadge && <div className="rounded-lg border bg-accent/40 px-4 py-2 text-xs">Based on: <span className="font-medium text-foreground">{profileBadge}</span></div>}

      {!sections
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, j) => <CardSkeleton key={j} />)}</div>
            </div>
          ))
        : sections.map((s, idx) => {
            const hook = savedHooks[idx];
            return s.items.length > 0 ? (
              <section key={s.title}>
                <h2 className="mb-3 text-lg font-semibold tracking-tight">{s.title}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {s.items.map((it) => (
                    <OpportunityCard key={it.id} item={it} saved={hook.savedSet.has(it.id)} onToggleSave={() => hook.toggle(it.id)} />
                  ))}
                </div>
              </section>
            ) : null;
          })}
    </div>
  );
}
