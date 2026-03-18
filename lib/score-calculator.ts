import { Subscription, ValueScore, ValueGrade } from "@/types";
import { toMonthlyAmount } from "./utils";

export function calcValueScore(sub: Subscription): ValueScore {
  const monthly = toMonthlyAmount(sub.amount, sub.billingCycle);
  const usagePerMonth = Math.max(sub.usageFrequency, 0.1);
  const costPerUse = monthly / usagePerMonth;

  // 등급 기준 (원/회)
  // A: ~500, B: ~1500, C: ~3000, D: ~6000, F: 6000+
  let score: number;
  let grade: ValueGrade;

  if (costPerUse <= 500) {
    score = 90 + Math.min(10, ((500 - costPerUse) / 500) * 10);
    grade = "A";
  } else if (costPerUse <= 1500) {
    score = 70 + ((1500 - costPerUse) / 1000) * 20;
    grade = "B";
  } else if (costPerUse <= 3000) {
    score = 50 + ((3000 - costPerUse) / 1500) * 20;
    grade = "C";
  } else if (costPerUse <= 6000) {
    score = 25 + ((6000 - costPerUse) / 3000) * 25;
    grade = "D";
  } else {
    score = Math.max(0, 25 - (costPerUse - 6000) / 500);
    grade = "F";
  }

  const gradeLabels: Record<ValueGrade, string> = {
    A: "매우 좋음",
    B: "좋음",
    C: "보통",
    D: "낮음",
    F: "재검토 필요",
  };

  return {
    score: Math.round(Math.min(100, Math.max(0, score))),
    grade,
    costPerUse: Math.round(costPerUse),
    label: gradeLabels[grade],
  };
}

export function gradeColor(grade: ValueGrade): string {
  return {
    A: "text-green-500",
    B: "text-blue-500",
    C: "text-yellow-500",
    D: "text-orange-500",
    F: "text-red-500",
  }[grade];
}

export function gradeBg(grade: ValueGrade): string {
  return {
    A: "bg-green-500/10 border-green-500/30",
    B: "bg-blue-500/10 border-blue-500/30",
    C: "bg-yellow-500/10 border-yellow-500/30",
    D: "bg-orange-500/10 border-orange-500/30",
    F: "bg-red-500/10 border-red-500/30",
  }[grade];
}
