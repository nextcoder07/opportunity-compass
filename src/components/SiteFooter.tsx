import { Link } from "@tanstack/react-router";
import { Sparkles, Mail, Github, Twitter, Linkedin } from "lucide-react";

const COLS = [
  {
    title: "Explore",
    links: [
      { to: "/auth", label: "Scholarships" },
      { to: "/auth", label: "Government Schemes" },
      { to: "/auth", label: "Education Loans" },
      { to: "/auth", label: "Internships" },
      { to: "/auth", label: "Competitions" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/auth", label: "Courses" },
      { to: "/auth", label: "Career Roadmaps" },
      { to: "/auth", label: "Blog & Guides" },
      { to: "/auth", label: "For You feed" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/auth", label: "Sign in" },
      { to: "/auth", label: "Create account" },
      { to: "/auth", label: "Reset password" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            OpportunityHub
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            One platform. Every opportunity. Every student. Built for Indian
            students — from Class 9 to your first job.
          </p>
          <div className="mt-4 flex gap-2">
            <a href="mailto:hello@opportunityhub.in" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-md border hover:bg-muted"><Mail className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-md border hover:bg-muted"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-md border hover:bg-muted"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-md border hover:bg-muted"><Github className="h-4 w-4" /></a>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-sm font-semibold">{col.title}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} OpportunityHub. Made with care in India.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="mailto:hello@opportunityhub.in" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
