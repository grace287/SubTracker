import { Header } from "@/components/layout/header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { SpendingChart } from "@/components/dashboard/spending-chart";

export default function DashboardPage() {
  return (
    <>
      <Header title="대시보드" subtitle="내 구독 현황" />
      <div className="p-0">
        <SummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-6 pb-6">
          <UpcomingPayments />
          <SpendingChart />
        </div>
      </div>
    </>
  );
}
