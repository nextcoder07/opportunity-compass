import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bookmark, Briefcase, FileText, GraduationCap, Home, LogOut, Search, Sparkles, Trophy, User as UserIcon, BookOpen, Banknote, Landmark, Map, Shield } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const TOP_NAV = [
  { to: "/suggestions", label: "Suggestions", icon: Sparkles },
  { to: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { to: "/schemes", label: "Schemes", icon: Landmark },
  { to: "/loans", label: "Loans", icon: Banknote },
  { to: "/internships", label: "Internships", icon: Briefcase },
  { to: "/competitions", label: "Competitions", icon: Trophy },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/careers", label: "Careers", icon: Map },
  { to: "/blog", label: "Blog", icon: FileText },
] as const;

const BOTTOM_NAV = [
  { to: "/suggestions", label: "For You", icon: Sparkles },
  { to: "/scholarships", label: "Scholar.", icon: GraduationCap },
  { to: "/internships", label: "Intern.", icon: Briefcase },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnread(count ?? 0);
    };
    load();
    const ch = supabase
      .channel("notif-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  const initials = (profile?.full_name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
            <span className="hidden sm:inline">OpportunityHub</span>
          </Link>
          <nav className="ml-2 hidden flex-1 items-center gap-1 overflow-x-auto lg:flex">
            {TOP_NAV.map((it) => {
              const active = pathname.startsWith(it.to);
              return (
                <Link key={it.to} to={it.to} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" aria-label="Search"><Link to="/search"><Search className="h-4 w-4" /></Link></Button>
            <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Link to="/notifications">
                <Bell className="h-4 w-4" />
                {unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{unread}</span>}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1"><Avatar className="h-8 w-8"><AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{initials}</AvatarFallback></Avatar></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{profile?.full_name || "Student"}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
                  {isAdmin && <Badge className="mt-1" variant="secondary"><Shield className="mr-1 h-3 w-3" />Admin</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/dashboard"><Home className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile"><UserIcon className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/saved"><Bookmark className="mr-2 h-4 w-4" />Saved</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/documents"><FileText className="mr-2 h-4 w-4" />Documents</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/applications"><Briefcase className="mr-2 h-4 w-4" />Applications</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 lg:pb-12">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-5">
          {BOTTOM_NAV.map((it) => {
            const active = pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link key={it.to} to={it.to} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
