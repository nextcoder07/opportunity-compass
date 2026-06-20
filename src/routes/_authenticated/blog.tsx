import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/blog")({ component: Page });

type Blog = { id: string; slug: string; title: string; excerpt: string | null; category: string | null; author: string | null; reading_time: number | null; published_at: string | null; tags: string[] | null };

function Page() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  useEffect(() => {
    supabase.from("blogs").select("*").eq("published", true).order("published_at", { ascending: false }).then(({ data }) => setPosts((data as Blog[]) || []));
  }, []);
  const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
  const filtered = posts.filter((p) => (!cat || p.category === cat) && (!q || p.title.toLowerCase().includes(q.toLowerCase())));
  const [featured, ...rest] = filtered;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Blog & News</h1>
        <p className="text-sm text-muted-foreground">Guides, tutorials, and news for Indian students.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant={cat === "" ? "default" : "outline"} onClick={() => setCat("")} className="cursor-pointer">All</Badge>
          {cats.map((c) => (
            <Badge key={c} variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)} className="cursor-pointer">{c}</Badge>
          ))}
        </div>
      </div>
      {featured && (
        <Link to="/blog/$slug" params={{ slug: featured.slug }}>
          <Card className="overflow-hidden transition hover:shadow-md">
            <CardContent className="p-6 md:p-10">
              <Badge variant="secondary" className="mb-3">Featured</Badge>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{featured.title}</h2>
              <p className="mt-2 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{featured.author}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.reading_time} min read</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md"><CardContent className="p-5">
              {p.category && <Badge variant="secondary" className="mb-2">{p.category}</Badge>}
              <h3 className="line-clamp-2 text-base font-semibold">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{p.reading_time} min · {p.author}</div>
            </CardContent></Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
