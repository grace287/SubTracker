"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { formatKRW, getDaysUntilBilling, getCategoryLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function UpcomingPayments() {
  const { subscriptions } = useSubscriptionStore();

  const upcoming = subscriptions
    .filter((s) => s.isActive)
    .map((s) => ({ ...s, daysLeft: getDaysUntilBilling(s.nextBillingDate) }))
    .filter((s) => s.daysLeft >= 0 && s.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (upcoming.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground">14일 내 예정된 결제가 없어요</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <h2 className="font-serif text-base font-semibold">결제 예정</h2>
        <Link href="/subscriptions" className="text-xs text-primary font-medium">전체 →</Link>
      </div>
      <div className="divide-y divide-border">
        {upcoming.map((sub) => (
          <Link key={sub.id} href={`/subscriptions/${sub.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors">
            {/* 날짜 */}
            <div className="w-8 text-center shrink-0">
              <p className={cn(
                "font-mono text-lg font-semibold leading-none",
                sub.daysLeft === 0 ? "text-primary" : "text-foreground"
              )}>
                {new Date(sub.nextBillingDate).getDate()}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5 uppercase">
                {["일","월","화","수","목","금","토"][new Date(sub.nextBillingDate).getDay()]}
              </p>
            </div>

            {/* 색상 점 */}
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{getCategoryLabel(sub.category)}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-mono text-sm font-medium">{formatKRW(sub.amount)}</p>
              <p className={cn(
                "text-[10px] font-semibold mt-0.5 px-1.5 py-0.5 rounded-full inline-block",
                sub.daysLeft === 0
                  ? "bg-primary text-primary-foreground"
                  : sub.daysLeft <= 3
                  ? "bg-warning-soft text-warning"
                  : "bg-success-soft text-success"
              )}>
                {sub.daysLeft === 0 ? "오늘" : `D-${sub.daysLeft}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
