"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { formatKRW, toMonthlyAmount } from "@/lib/utils";
import { TrendingDown, Calendar, CreditCard, AlertTriangle } from "lucide-react";

export function SummaryCards() {
  const { subscriptions } = useSubscriptionStore();
  const active = subscriptions.filter((s) => s.isActive);

  const totalMonthly = active.reduce(
    (sum, s) => sum + toMonthlyAmount(s.amount, s.billingCycle),
    0
  );
  const totalYearly = totalMonthly * 12;
  const trialCount = active.filter((s) => s.isTrial).length;
  const upcomingCount = active.filter((s) => {
    const days = Math.ceil(
      (new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000
    );
    return days >= 0 && days <= 7;
  }).length;

  const cards = [
    {
      label: "이번 달 지출",
      value: formatKRW(totalMonthly),
      sub: `연 ${formatKRW(totalYearly)}`,
      icon: CreditCard,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "활성 구독",
      value: `${active.length}개`,
      sub: `총 ${subscriptions.length}개 등록`,
      icon: TrendingDown,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "7일 내 결제 예정",
      value: `${upcomingCount}건`,
      sub: upcomingCount > 0 ? "결제일 확인하세요" : "이번 주 결제 없음",
      icon: Calendar,
      color: upcomingCount > 0 ? "text-yellow-400" : "text-green-400",
      bg: upcomingCount > 0 ? "bg-yellow-400/10" : "bg-green-400/10",
    },
    {
      label: "무료 체험 중",
      value: `${trialCount}개`,
      sub: trialCount > 0 ? "종료일 확인하세요" : "체험 중인 구독 없음",
      icon: AlertTriangle,
      color: trialCount > 0 ? "text-orange-400" : "text-muted-foreground",
      bg: trialCount > 0 ? "bg-orange-400/10" : "bg-muted/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 md:p-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-xl p-4 space-y-3"
        >
          <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-xl font-bold mt-0.5">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
