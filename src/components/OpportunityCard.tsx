import { Bookmark, BookmarkCheck, Calendar, ExternalLink, Share2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { matchColor } from "@/lib/match-score";
import { toast } from "sonner";

export type CardItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  amount?: string | null;
  deadline?: string | null;
  url?: string | null;
  tags?: string[] | null;
  location?: string | null;
  matchScore?: number;
  matchReasons?: string[];
};

export function OpportunityCard({
  item,
  saved,
  onToggleSave,
}: {
  item: CardItem;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const share = async () => {
    const url = item.url || window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: item.title, url }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  return (
    <Card className="group relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{item.title}</h3>
            {item.subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.subtitle}</p>}
          </div>
          {item.matchScore != null && (
            <div className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${matchColor(item.matchScore)}`}>
              {item.matchScore}% match
            </div>
          )}
        </div>

        {item.description && <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {item.amount && <span className="font-medium text-foreground">{item.amount}</span>}
          {item.deadline && (
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(item.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          )}
          {item.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px] font-normal">{t}</Badge>
            ))}
          </div>
        )}

        {item.matchReasons && item.matchReasons.length > 0 && (
          <p className="line-clamp-1 text-[11px] text-muted-foreground">Eligible: {item.matchReasons.join(" • ")}</p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
          {item.url && (
            <Button asChild size="sm" className="flex-1">
              <a href={item.url} target="_blank" rel="noreferrer">Apply <ExternalLink className="ml-1 h-3 w-3" /></a>
            </Button>
          )}
          <Button size="icon" variant="outline" onClick={onToggleSave} aria-label={saved ? "Unsave" : "Save"}>
            {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="outline" onClick={share} aria-label="Share"><Share2 className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CardSkeleton() {
  return (
    <Card><CardContent className="p-5">
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-8 w-full rounded bg-muted" />
      </div>
    </CardContent></Card>
  );
}
