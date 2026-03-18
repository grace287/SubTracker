"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { formatKRW, getDaysUntilBilling, toMonthlyAmount, getCategoryLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function UpcomingPayments() {
  const { subscriptions } = useSubscriptionStore();

  const upcoming = subscriptions
    .filter((s) => s.isActive)
    .map((s) => ({ ...s, daysLeft: getDaysUntilBilling(s.nextBillingDate) }))
    .filter((s) => s.daysLeft >= 0 && s.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (upcoming.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground">14일 내 예정된 결제가 없어요</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold">결제 예정</h2>
      </div>
      <div className="divide-y divide-border">
        {upcoming.map((sub) => (
          <div key={sub.id} className="flex items-center gap-3 px-4 py-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: sub.color }}
            >
              {sub.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{getCategoryLabel(sub.category)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold">{formatKRW(sub.amount)}</p>
              <p
                className={cn(
                  "text-xs font-medium",
                  sub.daysLeft === 0
                    ? "text-red-400"
                    : sub.daysLeft <= 3
                    ? "text-yellow-400"
                    : "text-muted-foreground"
                )}
              >
                {sub.daysLeft === 0 ? "오늘" : `${sub.daysLeft}일 후`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
