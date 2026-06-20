import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/blog/$slug")({ component: Page });

type Blog = { id: string; title: string; content: string | null; category: string | null; author: string | null; reading_time: number | null; published_at: string | null; excerpt: string | null };

function Page() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("blogs").select("*").eq("slug", slug).maybeSingle().then(({ data }) => { setPost(data as Blog | null); setLoading(false); });
  }, [slug]);
  if (loading) return <div className="grid h-64 place-items-center text-sm text-muted-foreground">Loading…</div>;
  if (!post) throw notFound();
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" />Back to blog</Link>
      {post.category && <Badge variant="secondary">{post.category}</Badge>}
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{post.author}</span><span>·</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.reading_time} min read</span>
      </div>
      <p className="text-lg text-muted-foreground">{post.excerpt}</p>
      <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-7">{post.content}</div>
    </article>
  );
}
