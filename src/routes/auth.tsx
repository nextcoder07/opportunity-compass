import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — OpportunityHub" },
      { name: "description", content: "Sign in or create an OpportunityHub account to unlock personalized scholarships, internships and careers." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate, pathname]);

  const [tab, setTab] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You can sign in now.");
    setTab("signin");
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Reset link sent. Check your inbox.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/40 px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
            OpportunityHub
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">One Platform. Every Opportunity. Every Student.</h1>
          <p className="mt-3 text-muted-foreground">Personalized scholarships, schemes, loans, internships, competitions, courses and career roadmaps — built for Indian students.</p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>✨ Personalized matches based on your profile</li>
            <li>🔔 Deadline reminders so you never miss out</li>
            <li>📁 60 MB document vault for certificates & marksheets</li>
            <li>🗺️ Career roadmaps from Class 9 to your dream job</li>
          </ul>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <Link to="/" className="mb-2 inline-flex items-center gap-2 font-bold lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
              OpportunityHub
            </Link>
            <CardTitle>{tab === "signup" ? "Create your account" : tab === "reset" ? "Reset password" : "Welcome back"}</CardTitle>
            <CardDescription>{tab === "signup" ? "Free forever for students." : tab === "reset" ? "We'll email a reset link." : "Sign in to your dashboard."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup" | "reset")} className="mb-4">
              <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger><TabsTrigger value="reset">Reset</TabsTrigger></TabsList>
              <TabsContent value="signin">
                <form onSubmit={signIn} className="space-y-3">
                  <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                  <Button type="submit" disabled={busy} className="w-full">{busy ? "Signing in…" : "Sign in"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={signUp} className="space-y-3">
                  <div><Label>Full name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><Label>Password (min 6 chars)</Label><Input type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                  <Button type="submit" disabled={busy} className="w-full">{busy ? "Creating…" : "Create account"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="reset">
                <form onSubmit={reset} className="space-y-3">
                  <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <Button type="submit" disabled={busy} className="w-full">{busy ? "Sending…" : "Send reset link"}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
