import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/components/DirectoryPage";
import { STATES, CATEGORIES, GENDERS } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/schemes")({ component: Page });

function Page() {
  return (
    <DirectoryPage
      config={{
        table: "schemes",
        itemType: "scheme",
        title: "Government Schemes (Yojana)",
        subtitle: "Central and state government schemes you may be eligible for.",
        searchColumns: ["name", "provider", "benefits"],
        defaultSort: "created_at:desc",
        sortOptions: [
          { value: "created_at:desc", label: "Newest" },
          { value: "name:asc", label: "Name A→Z" },
        ],
        filters: [
          { key: "state", label: "State", type: "select", column: "state", options: STATES },
          { key: "cat", label: "Category", type: "tag", column: "categories", options: CATEGORIES },
          { key: "gender", label: "Gender", type: "select", column: "gender", options: [...GENDERS] },
          { key: "type", label: "Scheme Type", type: "select", column: "scheme_type", options: ["Central","State"] },
          { key: "target", label: "Target Group", type: "select", column: "target_group", options: ["Students","Girls","Researchers","Apprentices"] },
        ],
        toCard: (r) => ({
          id: r.id as string,
          title: r.name as string,
          subtitle: r.provider as string | undefined,
          description: r.benefits as string | undefined,
          url: r.official_url as string | undefined,
          location: r.state as string | undefined,
          tags: r.tags as string[] | undefined,
        }),
        scoring: (r) => ({
          state: r.state as string | null,
          categories: r.categories as string[] | null,
          gender: r.gender as string | null,
          tags: r.tags as string[] | null,
        }),
      }}
    />
  );
}
