import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/Primitives";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Live figures from orders, customers and the catalogue."
      />
    </div>
  );
}
