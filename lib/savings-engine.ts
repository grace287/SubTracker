import { Subscription, SimulatorScenario, Category } from "@/types";
import { toMonthlyAmount } from "./utils";

// 같은 카테고리에서 여러 구독을 쓸 때 절약 시나리오 생성
export function generateScenarios(subscriptions: Subscription[]): SimulatorScenario[] {
  const active = subscriptions.filter((s) => s.isActive);
  const scenarios: SimulatorScenario[] = [];

  // 1. 카테고리 중복 구독
  const byCategory = groupByCategory(active);
  for (const [cat, subs] of Object.entries(byCategory)) {
    if (subs.length >= 2) {
      const sorted = [...subs].sort(
        (a, b) => toMonthlyAmount(a.amount, a.billingCycle) - toMonthlyAmount(b.amount, b.billingCycle)
      );
      const cheapest = sorted[0];
      const othersTotal = sorted
        .slice(1)
        .reduce((sum, s) => sum + toMonthlyAmount(s.amount, s.billingCycle), 0);

      scenarios.push({
        title: `${getCategoryLabel(cat as Category)} 구독 통합`,
        description: `${subs.map((s) => s.name).join(", ")} 중 "${cheapest.name}" 하나만 유지하면`,
        monthlySaving: othersTotal,
        yearlySaving: othersTotal * 12,
        type: "cancel",
        subscriptionIds: sorted.slice(1).map((s) => s.id),
      });
    }
  }

  // 2. 저빈도 사용 구독 해지 시나리오
  const lowUsage = active.filter((s) => s.usageFrequency <= 2);
  lowUsage.forEach((s) => {
    const monthly = toMonthlyAmount(s.amount, s.billingCycle);
    scenarios.push({
      title: `"${s.name}" 해지`,
      description: `월 ${s.usageFrequency}회 미만 사용 중 — 해지 시`,
      monthlySaving: monthly,
      yearlySaving: monthly * 12,
      type: "cancel",
      subscriptionIds: [s.id],
    });
  });

  // 3. 연간 결제 전환 시나리오 (월결제 → 연결제 약 17% 절약)
  const monthlyBilled = active.filter((s) => s.billingCycle === "monthly");
  monthlyBilled.forEach((s) => {
    const monthly = s.amount;
    const yearlySaving = Math.round(monthly * 12 * 0.17);
    if (yearlySaving >= 5000) {
      scenarios.push({
        title: `"${s.name}" 연간 결제 전환`,
        description: `월결제 → 연간결제 전환 시 약 17% 절약`,
        monthlySaving: Math.round(yearlySaving / 12),
        yearlySaving,
        type: "switch",
        subscriptionIds: [s.id],
      });
    }
  });

  return scenarios.sort((a, b) => b.yearlySaving - a.yearlySaving).slice(0, 6);
}

function groupByCategory(subs: Subscription[]): Record<string, Subscription[]> {
  return subs.reduce<Record<string, Subscription[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});
}

function getCategoryLabel(category: Category): string {
  const map: Record<Category, string> = {
    OTT: "OTT",
    music: "음악",
    cloud: "클라우드",
    productivity: "생산성",
    gaming: "게임",
    education: "교육",
    fitness: "피트니스",
    news: "뉴스",
    shopping: "쇼핑",
    other: "기타",
  };
  return map[category] ?? category;
}

// 전체 절약 가능 금액 합산 (중복 제거)
export function calcTotalPotentialSaving(scenarios: SimulatorScenario[]): number {
  const counted = new Set<string>();
  let total = 0;
  for (const s of scenarios) {
    const key = s.subscriptionIds.sort().join(",");
    if (!counted.has(key)) {
      counted.add(key);
      total += s.monthlySaving;
    }
  }
  return total;
}
