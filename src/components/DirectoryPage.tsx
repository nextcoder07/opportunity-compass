import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useSavedSet } from "@/lib/use-saved";
import { matchScore } from "@/lib/match-score";
import { OpportunityCard, CardSkeleton, type CardItem } from "@/components/OpportunityCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, SlidersHorizontal } from "lucide-react";

type Field =
  | { key: string; label: string; type: "select"; column: string; options: string[] }
  | { key: string; label: string; type: "tag"; column: string; options: string[] }
  | { key: string; label: string; type: "boolean"; column: string };

export type DirectoryConfig<T extends Record<string, unknown>> = {
  table: "scholarships" | "schemes" | "loans" | "internships" | "competitions" | "courses" | "blogs";
  itemType: string;
  title: string;
  subtitle: string;
  searchColumns: string[];
  sortOptions: { value: string; label: string }[];
  defaultSort: string;
  filters: Field[];
  toCard: (row: T) => CardItem;
  scoring?: (row: T) => Parameters<typeof matchScore>[1];
};

export function DirectoryPage<T extends Record<string, unknown>>({ config }: { config: DirectoryConfig<T> }) {
  const { profile } = useAuth();
  const { savedSet, toggle } = useSavedSet(config.itemType);
  const [rows, setRows] = useState<T[] | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(config.defaultSort);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setRows(null);
      let query = supabase.from(config.table).select("*");
      // server-side filter
      for (const f of config.filters) {
        const v = filters[f.key];
        if (!v) continue;
        if (f.type === "tag") query = query.contains(f.column, [v]);
        else if (f.type === "boolean") query = query.eq(f.column, v === "true");
        else query = query.eq(f.column, v);
      }
      if (q) {
        const or = config.searchColumns.map((c) => `${c}.ilike.%${q}%`).join(",");
        query = query.or(or);
      }
      const [col, dir] = sort.split(":");
      query = query.order(col, { ascending: dir === "asc", nullsFirst: false }).limit(60);
      const { data, error } = await query;
      if (cancel) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data as T[]) || []);
      }
    })();
    return () => { cancel = true; };
  }, [config.table, q, sort, JSON.stringify(filters)]); // eslint-disable-line

  const items = useMemo(() => {
    if (!rows) return null;
    return rows
      .map((r) => {
        const card = config.toCard(r);
        if (config.scoring) {
          const { score, reasons } = matchScore(profile, config.scoring(r));
          card.matchScore = score;
          card.matchReasons = reasons;
        }
        return card;
      })
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }, [rows, profile, config]);

  const clear = () => { setFilters({}); setQ(""); };
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{config.title}</h1>
        <p className="text-sm text-muted-foreground">{config.subtitle}</p>
      </div>

      {profile?.onboarded && (
        <div className="rounded-lg border bg-accent/30 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Recommended for you</span> · based on{" "}
          {[profile.education_level, profile.state, profile.category, profile.income_range].filter(Boolean).join(" · ")}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{config.sortOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setShowFilters((s) => !s)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />Filters{activeCount > 0 && <Badge variant="secondary" className="ml-2">{activeCount}</Badge>}
        </Button>
      </div>

      {showFilters && (
        <div className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          {config.filters.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{f.label}</label>
              <Select value={filters[f.key] || "__any__"} onValueChange={(v) => setFilters((p) => ({ ...p, [f.key]: v === "__any__" ? "" : v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__any__">Any</SelectItem>
                  {f.type === "boolean"
                    ? <>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </>
                    : (f as { options: string[] }).options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="flex items-end"><Button variant="ghost" onClick={clear}><X className="mr-1 h-4 w-4" />Reset</Button></div>
        </div>
      )}

      {!items ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : items.length === 0 ? (
        <div className="grid place-items-center rounded-lg border bg-card p-12 text-center">
          <p className="text-sm font-medium">No results match your filters.</p>
          <p className="mt-1 text-xs text-muted-foreground">Try resetting filters or changing search.</p>
          <Button variant="outline" className="mt-4" onClick={clear}>Reset filters</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <OpportunityCard key={c.id} item={c} saved={savedSet.has(c.id)} onToggleSave={() => toggle(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
