import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/notifications")({ component: Page });

type N = { id: string; title: string; body: string | null; link: string | null; kind: string | null; read: boolean; created_at: string };

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useState<N[]>([]);
  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    setItems((data as N[]) || []);
  };
  useEffect(() => { load(); }, [user]); // eslint-disable-line
  const markAll = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    load();
  };
  const mark = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    load();
  };
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">{items.filter((i) => !i.read).length} unread</p>
        </div>
        {items.some((i) => !i.read) && <Button variant="outline" size="sm" onClick={markAll}><Check className="mr-1 h-3 w-3" />Mark all read</Button>}
      </div>
      {items.length === 0 ? (
        <Card><CardContent className="grid place-items-center p-10 text-center text-sm text-muted-foreground">
          <Bell className="mb-2 h-8 w-8" />You're all caught up.
        </CardContent></Card>
      ) : items.map((n) => (
        <Card key={n.id} className={n.read ? "opacity-70" : "border-primary/40"}>
          <CardContent className="flex items-start gap-3 p-4">
            <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
            <div className="flex-1">
              <div className="text-sm font-semibold">{n.title}</div>
              {n.body && <div className="mt-0.5 text-sm text-muted-foreground">{n.body}</div>}
              <div className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
            </div>
            {!n.read && <Button size="sm" variant="ghost" onClick={() => mark(n.id)}>Mark read</Button>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
