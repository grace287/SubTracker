import { Header } from "@/components/layout/header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { UpcomingPayments } from "@/components/dashboard/upcoming-payments";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { SavingsBanner } from "@/components/dashboard/savings-banner";

export default function DashboardPage() {
  return (
    <>
      <Header title="SubTracker" subtitle="구독 지출 인텔리전스" serif />
      <SummaryCards />
      <SavingsBanner />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 md:px-6 pb-6">
        <UpcomingPayments />
        <SpendingChart />
      </div>
    </>
  );
}
