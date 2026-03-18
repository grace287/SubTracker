"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { toMonthlyAmount, getCategoryLabel, getCategoryColor, formatKRW } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Category } from "@/types";

export function SpendingChart() {
  const { subscriptions } = useSubscriptionStore();
  const active = subscriptions.filter((s) => s.isActive);

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
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-base font-semibold">카테고리별 지출</h2>
        <span className="font-mono text-xs text-muted-foreground">{formatKRW(total)}/월</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
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
                      <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
                        <p className="font-medium">{d.name}</p>
                        <p className="text-muted-foreground font-mono">{formatKRW(d.value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.slice(0, 5).map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-muted-foreground flex-1 truncate">{d.name}</span>
              <span className="font-mono text-xs font-medium">{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
