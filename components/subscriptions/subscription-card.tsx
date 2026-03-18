"use client";

import Link from "next/link";
import { Subscription } from "@/types";
import {
  formatKRW,
  getDaysUntilBilling,
  getUsageDuration,
  toMonthlyAmount,
  getCategoryLabel,
} from "@/lib/utils";
import { calcValueScore, gradeColor, gradeBg } from "@/lib/score-calculator";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface Props {
  sub: Subscription;
}

const CYCLE_LABEL = { weekly: "주", monthly: "월", yearly: "년" };

export function SubscriptionCard({ sub }: Props) {
  const score = calcValueScore(sub);
  const daysLeft = getDaysUntilBilling(sub.nextBillingDate);
  const monthly = toMonthlyAmount(sub.amount, sub.billingCycle);

  return (
    <Link href={`/subscriptions/${sub.id}`} className="block">
      <div
        className={cn(
          "bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5",
          !sub.isActive && "opacity-50"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon + Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-sm"
              style={{ backgroundColor: sub.color }}
            >
              {sub.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{getCategoryLabel(sub.category)}</p>
            </div>
          </div>

          {/* Value Grade */}
          <div
            className={cn(
              "shrink-0 px-2 py-1 rounded-lg border text-xs font-bold",
              gradeBg(score.grade),
              gradeColor(score.grade)
            )}
          >
            {score.grade}
          </div>
        </div>

        {/* Amount */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-xl font-bold">{formatKRW(sub.amount)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {CYCLE_LABEL[sub.billingCycle]}</span>
            {sub.billingCycle !== "monthly" && (
              <p className="text-xs text-muted-foreground">월 {formatKRW(monthly)}</p>
            )}
          </div>

          {/* Billing countdown */}
          <div
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-lg",
              daysLeft <= 3
                ? "bg-red-500/10 text-red-400"
                : daysLeft <= 7
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            <Calendar className="w-3 h-3" />
            {daysLeft === 0 ? "오늘 결제" : `${daysLeft}일 후`}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getUsageDuration(sub.startDate)} 사용 중
          </div>
          <div>월 {sub.usageFrequency}회 사용</div>
        </div>
      </div>
    </Link>
  );
}
