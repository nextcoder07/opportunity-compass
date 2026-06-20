import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/components/DirectoryPage";
import { EDUCATION } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/competitions")({ component: Page });

function Page() {
  return (
    <DirectoryPage
      config={{
        table: "competitions",
        itemType: "competition",
        title: "Competitions",
        subtitle: "Hackathons, olympiads, entrance exams and startup challenges.",
        searchColumns: ["name", "organizer"],
        defaultSort: "deadline:asc",
        sortOptions: [
          { value: "deadline:asc", label: "Deadline (soonest)" },
          { value: "created_at:desc", label: "Newest" },
        ],
        filters: [
          { key: "category", label: "Category", type: "select", column: "category", options: ["Hackathon","Olympiad","Exam","Startup Competition","Innovation Challenge"] },
          { key: "edu", label: "Education", type: "select", column: "education_level", options: EDUCATION },
          { key: "mode", label: "Mode", type: "select", column: "mode", options: ["Online","Offline","Hybrid"] },
          { key: "domain", label: "Domain", type: "select", column: "domain", options: ["Software Development","Data Science","AI","Design","Engineering","Mathematics","Science","Entrepreneurship"] },
        ],
        toCard: (r) => ({
          id: r.id as string,
          title: r.name as string,
          subtitle: r.organizer as string | undefined,
          amount: r.prize as string | undefined,
          deadline: r.deadline as string | null,
          url: r.apply_url as string | undefined,
          tags: [r.category as string, r.mode as string, ...(r.tags as string[] | null ?? [])].filter(Boolean) as string[],
        }),
        scoring: (r) => ({
          education_levels: r.education_level ? [r.education_level as string] : null,
          tags: r.tags as string[] | null,
          domain: r.domain as string | null,
        }),
      }}
    />
  );
}
