import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/components/DirectoryPage";
import { STATES, EDUCATION, CATEGORIES, GENDERS, SOURCE_TYPES, SCOPES } from "@/lib/options";

export const Route = createFileRoute("/_authenticated/scholarships")({ component: Page });

function Page() {
  return (
    <DirectoryPage
      config={{
        table: "scholarships",
        itemType: "scholarship",
        title: "Scholarships",
        subtitle: "Government, NGO and private scholarships personalized for you.",
        searchColumns: ["name", "provider", "description"],
        defaultSort: "deadline:asc",
        sortOptions: [
          { value: "deadline:asc", label: "Deadline (soonest)" },
          { value: "popularity:desc", label: "Most popular" },
          { value: "created_at:desc", label: "Newest" },
        ],
        filters: [
          { key: "state", label: "State", type: "select", column: "state", options: STATES },
          { key: "edu", label: "Education", type: "tag", column: "education_levels", options: EDUCATION },
          { key: "cat", label: "Category", type: "tag", column: "categories", options: CATEGORIES },
          { key: "gender", label: "Gender", type: "select", column: "gender", options: [...GENDERS, "Any"] },
          { key: "field", label: "Field", type: "tag", column: "fields", options: ["Any","Science","Engineering","Medicine","Management","Law","Technology"] },
          { key: "source", label: "Source", type: "select", column: "source_type", options: SOURCE_TYPES },
          { key: "scope", label: "Scope", type: "select", column: "scope", options: SCOPES },
        ],
        toCard: (r) => ({
          id: r.id as string,
          title: r.name as string,
          subtitle: r.provider as string,
          description: r.description as string | undefined,
          amount: r.amount as string | undefined,
          deadline: r.deadline as string | null,
          url: r.apply_url as string | undefined,
          location: r.state as string | undefined,
          tags: r.tags as string[] | undefined,
        }),
        scoring: (r) => ({
          education_levels: r.education_levels as string[] | null,
          state: r.state as string | null,
          categories: r.categories as string[] | null,
          income_max: r.income_max as number | null,
          gender: r.gender as string | null,
          fields: r.fields as string[] | null,
          tags: r.tags as string[] | null,
        }),
      }}
    />
  );
}
