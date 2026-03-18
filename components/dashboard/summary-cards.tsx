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
  const trialCount = active.filter((s) => s.isTrial).length;
  const upcomingCount = active.filter((s) => {
    const days = Math.ceil(
      (new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000
    );
    return days >= 0 && days <= 7;
  }).length;
  const nextPayment = active
    .map((s) => ({ ...s, days: Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000) }))
    .filter((s) => s.days >= 0)
    .sort((a, b) => a.days - b.days)[0];

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* 메인 요약 카드 — 목업의 dark summary card */}
      <div className="relative bg-foreground text-background rounded-2xl p-5 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/[0.04]" />
        <div className="absolute right-4 -bottom-8 w-20 h-20 rounded-full bg-primary/20" />

        <p className="text-[11px] tracking-[2px] uppercase opacity-50 font-light mb-1.5">이번 달 구독 지출</p>
        <p className="font-serif text-4xl font-bold tracking-tight leading-none mb-1">
          {totalMonthly.toLocaleString()}
          <span className="text-base font-sans font-light opacity-70 ml-1.5">원</span>
        </p>
        <p className="text-xs opacity-55 mt-2">
          활성 구독 {active.length}개 · 연간 {formatKRW(totalMonthly * 12)}
        </p>

        <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="flex-1">
            <p className="font-mono text-xl font-medium leading-none">{active.length}</p>
            <p className="text-[10px] opacity-45 mt-1">활성 구독</p>
          </div>
          <div className="flex-1">
            <p className="font-mono text-xl font-medium leading-none">
              ₩{Math.round(totalMonthly * 12 / 1000)}K
            </p>
            <p className="text-[10px] opacity-45 mt-1">연간 환산</p>
          </div>
          <div className="flex-1">
            <p className="font-mono text-xl font-medium leading-none">
              {nextPayment ? (nextPayment.days === 0 ? "D-0" : `D-${nextPayment.days}`) : "—"}
            </p>
            <p className="text-[10px] opacity-45 mt-1">다음 결제</p>
          </div>
        </div>
      </div>

      {/* 보조 카드 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="font-mono text-lg font-semibold leading-none">{upcomingCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">7일 내 결제</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-info-soft flex items-center justify-center mb-2">
            <TrendingDown className="w-3.5 h-3.5 text-info" />
          </div>
          <p className="font-mono text-lg font-semibold leading-none">{subscriptions.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">전체 구독</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${trialCount > 0 ? "bg-warning-soft" : "bg-muted"}`}>
            <AlertTriangle className={`w-3.5 h-3.5 ${trialCount > 0 ? "text-warning" : "text-muted-foreground"}`} />
          </div>
          <p className="font-mono text-lg font-semibold leading-none">{trialCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">체험 중</p>
        </div>
      </div>
    </div>
  );
}
