import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/components/DirectoryPage";

export const Route = createFileRoute("/_authenticated/loans")({ component: Page });

function Page() {
  return (
    <DirectoryPage
      config={{
        table: "loans",
        itemType: "loan",
        title: "Education Loans",
        subtitle: "Compare public banks, private banks and NBFCs.",
        searchColumns: ["name", "bank"],
        defaultSort: "created_at:desc",
        sortOptions: [
          { value: "created_at:desc", label: "Newest" },
          { value: "bank:asc", label: "Bank A→Z" },
        ],
        filters: [
          { key: "type", label: "Bank Type", type: "select", column: "bank_type", options: ["Public","Private","NBFC"] },
        ],
        toCard: (r) => ({
          id: r.id as string,
          title: r.name as string,
          subtitle: r.bank as string,
          description: r.eligibility as string | undefined,
          amount: `${r.max_amount as string} · ${r.interest_rate as string}`,
          url: r.apply_url as string | undefined,
          tags: [r.bank_type as string, r.repayment as string].filter(Boolean) as string[],
        }),
      }}
    />
  );
}
