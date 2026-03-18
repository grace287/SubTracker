"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Header } from "@/components/layout/header";
import {
  formatKRW,
  toMonthlyAmount,
  toYearlyAmount,
  getCategoryLabel,
  getCategoryColor,
  getUsageDuration,
} from "@/lib/utils";
import { calcValueScore, gradeColor } from "@/lib/score-calculator";
import { Category } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { subscriptions } = useSubscriptionStore();
  const active = subscriptions.filter((s) => s.isActive);

  const totalMonthly = active.reduce(
    (sum, s) => sum + toMonthlyAmount(s.amount, s.billingCycle),
    0
  );

  // 카테고리별
  const byCategory = active.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + toMonthlyAmount(s.amount, s.billingCycle);
    return acc;
  }, {});

  const categoryData = Object.entries(byCategory)
    .map(([cat, amount]) => ({
      name: getCategoryLabel(cat as Category),
      amount,
      color: getCategoryColor(cat as Category),
    }))
    .sort((a, b) => b.amount - a.amount);

  // 가성비 순위
  const scored = active
    .map((s) => ({ ...s, score: calcValueScore(s) }))
    .sort((a, b) => b.score.score - a.score.score);

  return (
    <>
      <Header title="지출 분석" subtitle={`이번 달 ${formatKRW(totalMonthly)}`} />
      <div className="p-4 md:p-6 space-y-6">
        {/* 연간 요약 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">이번 달</p>
            <p className="text-2xl font-bold mt-1">{formatKRW(totalMonthly)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">연간 예상</p>
            <p className="text-2xl font-bold mt-1">{formatKRW(totalMonthly * 12)}</p>
          </div>
        </div>

        {/* 카테고리 바 차트 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-4">카테고리별 월 지출</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 16, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p>{formatKRW(payload[0].value as number)}</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {categoryData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 가성비 랭킹 */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">가성비 랭킹</h2>
          </div>
          <div className="divide-y divide-border">
            {scored.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs text-muted-foreground w-5">{i + 1}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: s.color }}
                >
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    1회 {formatKRW(s.score.costPerUse)} · {getUsageDuration(s.startDate)}
                  </p>
                </div>
                <span className={`text-sm font-bold ${gradeColor(s.score.grade)}`}>
                  {s.score.grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
