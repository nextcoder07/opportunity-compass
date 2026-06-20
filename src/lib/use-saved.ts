import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth-context";
import { toast } from "sonner";

export function useSavedSet(itemType: string) {
  const { user } = useAuth();
  const [set, setSet] = useState<Set<string>>(new Set());

  const reload = useCallback(async () => {
    if (!user) return setSet(new Set());
    const { data } = await supabase
      .from("saved_items")
      .select("item_id")
      .eq("user_id", user.id)
      .eq("item_type", itemType);
    setSet(new Set((data || []).map((r) => r.item_id)));
  }, [user, itemType]);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggle = useCallback(
    async (itemId: string) => {
      if (!user) {
        toast.error("Please sign in to save items");
        return;
      }
      if (set.has(itemId)) {
        await supabase
          .from("saved_items")
          .delete()
          .eq("user_id", user.id)
          .eq("item_type", itemType)
          .eq("item_id", itemId);
        setSet((prev) => {
          const n = new Set(prev);
          n.delete(itemId);
          return n;
        });
        toast.success("Removed from saved");
      } else {
        await supabase
          .from("saved_items")
          .insert({ user_id: user.id, item_type: itemType, item_id: itemId });
        setSet((prev) => new Set(prev).add(itemId));
        toast.success("Saved");
      }
    },
    [user, itemType, set],
  );

  return { savedSet: set, toggle, reload };
}
