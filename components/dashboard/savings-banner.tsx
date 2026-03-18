"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { generateScenarios, calcTotalPotentialSaving } from "@/lib/savings-engine";
import { formatKRW } from "@/lib/utils";
import Link from "next/link";
import { TrendingDown, ChevronRight } from "lucide-react";

export function SavingsBanner() {
  const { subscriptions } = useSubscriptionStore();
  const scenarios = generateScenarios(subscriptions);
  const total = calcTotalPotentialSaving(scenarios);

  if (total === 0 || scenarios.length === 0) return null;

  const dupCount = scenarios.filter((s) => s.type === "cancel").length;

  return (
    <Link href="/simulator" className="block mx-4 md:mx-6 mb-4">
      <div className="bg-success-soft border border-success/30 dark:border-success/20 rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-success/60 transition-colors">
        <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
          <TrendingDown className="w-4 h-4 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-success dark:text-green-400">
            월 {formatKRW(total)} 절약 가능해요
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {dupCount > 0 ? `유사 구독 ${dupCount}건 중복 감지` : `${scenarios.length}가지 절약 시나리오`} · 탭해서 확인
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}
