import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/_authenticated/applications")({ component: Page });

type App = { id: string; item_type: string; item_id: string; status: string; notes: string | null; applied_at: string | null; created_at: string };

function Page() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("applications").select("*").order("created_at", { ascending: false }).then(({ data }) => setApps((data as App[]) || []));
  }, [user]);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Application tracker</h1>
        <p className="text-sm text-muted-foreground">Track applications you've started across opportunities.</p>
      </div>
      {apps.length === 0 ? (
        <Card><CardContent className="grid place-items-center p-10 text-center text-sm text-muted-foreground">
          <Briefcase className="mb-2 h-8 w-8" />No applications tracked yet.
        </CardContent></Card>
      ) : apps.map((a) => (
        <Card key={a.id}><CardContent className="flex items-center justify-between p-4">
          <div>
            <div className="text-sm font-medium">{a.item_type} · {a.item_id.slice(0, 8)}…</div>
            {a.notes && <div className="text-xs text-muted-foreground">{a.notes}</div>}
          </div>
          <Badge variant="secondary">{a.status}</Badge>
        </CardContent></Card>
      ))}
    </div>
  );
}
