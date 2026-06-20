import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/components/DirectoryPage";

export const Route = createFileRoute("/_authenticated/internships")({ component: Page });

function Page() {
  return (
    <DirectoryPage
      config={{
        table: "internships",
        itemType: "internship",
        title: "Internships",
        subtitle: "Top internships from companies, startups and government.",
        searchColumns: ["title", "company", "domain"],
        defaultSort: "deadline:asc",
        sortOptions: [
          { value: "deadline:asc", label: "Deadline (soonest)" },
          { value: "created_at:desc", label: "Newest" },
        ],
        filters: [
          { key: "domain", label: "Domain", type: "select", column: "domain", options: ["Software Development","Data Science","AI","Design","Business","Civil Services"] },
          { key: "mode", label: "Mode", type: "select", column: "mode", options: ["Remote","Hybrid","Onsite"] },
          { key: "paid", label: "Paid", type: "boolean", column: "paid" },
          { key: "source", label: "Source", type: "select", column: "source", options: ["Internshala","Government","Startups","Companies"] },
        ],
        toCard: (r) => ({
          id: r.id as string,
          title: r.title as string,
          subtitle: r.company as string,
          amount: r.stipend as string | undefined,
          deadline: r.deadline as string | null,
          location: r.location as string | undefined,
          url: r.apply_url as string | undefined,
          tags: [r.mode as string, r.duration as string, ...(r.tags as string[] | null ?? [])].filter(Boolean) as string[],
        }),
        scoring: (r) => ({
          domain: r.domain as string | null,
          tags: r.tags as string[] | null,
        }),
      }}
    />
  );
}
