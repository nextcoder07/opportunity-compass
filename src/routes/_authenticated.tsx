import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { OnboardingDialog } from "@/components/OnboardingDialog";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}

function Inner() {
  const { profile, loading, refreshProfile } = useAuth();
  const needsOnboarding = !loading && profile && !profile.onboarded;
  return (
    <AppShell>
      <Outlet />
      {needsOnboarding && <OnboardingDialog open onDone={() => refreshProfile()} />}
    </AppShell>
  );
}
