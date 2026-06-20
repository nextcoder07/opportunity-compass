import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/components/DirectoryPage";
import { EDUCATION } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/courses")({ component: Page });

function Page() {
  return (
    <DirectoryPage
      config={{
        table: "courses",
        itemType: "course",
        title: "Courses & Certifications",
        subtitle: "Free and paid courses from NPTEL, SWAYAM, Coursera, edX and more.",
        searchColumns: ["name", "provider", "subject"],
        defaultSort: "created_at:desc",
        sortOptions: [
          { value: "created_at:desc", label: "Newest" },
          { value: "name:asc", label: "A→Z" },
        ],
        filters: [
          { key: "edu", label: "Education", type: "select", column: "education_level", options: EDUCATION },
          { key: "subject", label: "Subject", type: "select", column: "subject", options: ["Software Development","Data Science","AI","Design","Law","Civil Services"] },
          { key: "free", label: "Free", type: "boolean", column: "free" },
          { key: "cert", label: "Certification", type: "boolean", column: "certification" },
        ],
        toCard: (r) => ({
          id: r.id as string,
          title: r.name as string,
          subtitle: r.provider as string | undefined,
          description: r.description as string | undefined,
          amount: r.duration as string | undefined,
          url: r.url as string | undefined,
          tags: [
            r.free ? "Free" : "Paid",
            r.certification ? "Certificate" : null,
            ...(r.tags as string[] | null ?? []),
          ].filter(Boolean) as string[],
        }),
        scoring: (r) => ({
          subject: r.subject as string | null,
          tags: r.tags as string[] | null,
        }),
      }}
    />
  );
}
