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
    <Link href={`/subscriptions/${sub.id}`} className="block group">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl p-4",
          "hover:border-primary/30 hover:shadow-md transition-all duration-200",
          !sub.isActive && "opacity-50"
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shrink-0 text-sm"
              style={{ backgroundColor: sub.color }}
            >
              {sub.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{getCategoryLabel(sub.category)}</p>
            </div>
          </div>

          <div
            className={cn(
              "shrink-0 w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center",
              gradeBg(score.grade),
              gradeColor(score.grade)
            )}
          >
            {score.grade}
          </div>
        </div>

        {/* 금액 + 결제일 */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xl font-semibold">{formatKRW(sub.amount)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {CYCLE_LABEL[sub.billingCycle]}</span>
            {sub.billingCycle !== "monthly" && (
              <p className="text-xs text-muted-foreground">월 {formatKRW(monthly)}</p>
            )}
          </div>

          <div
            className={cn(
              "flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg",
              daysLeft === 0
                ? "bg-primary text-primary-foreground"
                : daysLeft <= 3
                ? "bg-warning-soft text-warning"
                : daysLeft <= 7
                ? "bg-warning-soft/60 text-warning"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Calendar className="w-3 h-3" />
            {daysLeft === 0 ? "오늘" : `D-${daysLeft}`}
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getUsageDuration(sub.startDate)} 구독 중
          </div>
          <div className="font-mono">월 {sub.usageFrequency}회</div>
        </div>
      </div>
    </Link>
  );
}
