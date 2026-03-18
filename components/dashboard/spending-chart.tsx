"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { toMonthlyAmount, getCategoryLabel, getCategoryColor } from "@/lib/utils";
import { formatKRW } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Category } from "@/types";

export function SpendingChart() {
  const { subscriptions } = useSubscriptionStore();
  const active = subscriptions.filter((s) => s.isActive);

  // 카테고리별 합산
  const byCategory = active.reduce<Record<string, number>>((acc, s) => {
    const monthly = toMonthlyAmount(s.amount, s.billingCycle);
    acc[s.category] = (acc[s.category] ?? 0) + monthly;
    return acc;
  }, {});

  const data = Object.entries(byCategory)
    .map(([cat, amount]) => ({
      name: getCategoryLabel(cat as Category),
      value: amount,
      color: getCategoryColor(cat as Category),
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-4">카테고리별 지출</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0];
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
                        <p className="font-medium">{d.name}</p>
                        <p className="text-muted-foreground">{formatKRW(d.value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
              <span className="text-xs font-medium">{formatKRW(d.value)}</span>
              <span className="text-xs text-muted-foreground w-10 text-right">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
