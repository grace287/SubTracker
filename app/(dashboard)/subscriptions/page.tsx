"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Category } from "@/types";
import { getCategoryLabel, toMonthlyAmount, formatKRW } from "@/lib/utils";

const CATEGORIES: (Category | "all")[] = [
  "all", "OTT", "music", "cloud", "productivity", "gaming",
  "education", "fitness", "news", "shopping", "other",
];

export default function SubscriptionsPage() {
  const { subscriptions } = useSubscriptionStore();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [showInactive, setShowInactive] = useState(false);

  const filtered = subscriptions.filter((s) => {
    if (!showInactive && !s.isActive) return false;
    if (filter !== "all" && s.category !== filter) return false;
    return true;
  });

  const totalMonthly = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + toMonthlyAmount(s.amount, s.billingCycle), 0);

  return (
    <>
      <Header title="구독 목록" subtitle={`총 ${formatKRW(totalMonthly)}/월`} />
      <div className="p-4 md:p-6 space-y-4">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "전체" : getCategoryLabel(c)}
            </button>
          ))}
        </div>

        {/* 비활성 토글 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filtered.length}개 구독</p>
          <button
            onClick={() => setShowInactive((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showInactive ? "비활성 숨기기" : "비활성 보기"}
          </button>
        </div>

        {/* 카드 그리드 */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>구독이 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
