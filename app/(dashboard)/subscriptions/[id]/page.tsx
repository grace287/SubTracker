"use client";

import { useParams, useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Header } from "@/components/layout/header";
import { formatKRW, getUsageDuration, getDaysUntilBilling, toMonthlyAmount, getCategoryLabel } from "@/lib/utils";
import { calcValueScore, gradeColor, gradeBg } from "@/lib/score-calculator";
import { cn } from "@/lib/utils";
import { Trash2, Edit, Calendar, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { subscriptions, deleteSubscription, toggleActive } = useSubscriptionStore();
  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        구독을 찾을 수 없어요
      </div>
    );
  }

  const score = calcValueScore(sub);
  const monthly = toMonthlyAmount(sub.amount, sub.billingCycle);
  const daysLeft = getDaysUntilBilling(sub.nextBillingDate);

  function handleDelete() {
    if (confirm(`"${sub!.name}" 구독을 삭제할까요?`)) {
      deleteSubscription(id);
      router.push("/subscriptions");
    }
  }

  return (
    <>
      <Header title={sub.name} subtitle={getCategoryLabel(sub.category)} />
      <div className="p-4 md:p-6 max-w-lg space-y-4">
        {/* Hero card */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ backgroundColor: sub.color }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm">월 환산 금액</p>
              <p className="text-3xl font-bold mt-1">{formatKRW(monthly)}</p>
              <p className="text-white/70 text-sm mt-1">
                연간 {formatKRW(monthly * 12)}
              </p>
            </div>
            <div
              className={cn(
                "px-3 py-1.5 rounded-xl border text-lg font-bold",
                gradeBg(score.grade),
                gradeColor(score.grade)
              )}
            >
              {score.grade}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex gap-4 text-sm">
            <div>
              <p className="text-white/70">1회 사용 단가</p>
              <p className="font-semibold">{formatKRW(score.costPerUse)}</p>
            </div>
            <div>
              <p className="text-white/70">가성비</p>
              <p className="font-semibold">{score.label}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Calendar, label: "결제까지", value: daysLeft === 0 ? "오늘" : `${daysLeft}일` },
            { icon: Clock, label: "사용 기간", value: getUsageDuration(sub.startDate) },
            { icon: TrendingUp, label: "월 사용", value: `${sub.usageFrequency}회` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-bold mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {[
            { label: "결제 금액", value: `${formatKRW(sub.amount)} / ${sub.billingCycle === "monthly" ? "월" : sub.billingCycle === "yearly" ? "년" : "주"}` },
            { label: "구독 시작일", value: sub.startDate },
            { label: "다음 결제일", value: sub.nextBillingDate },
            { label: "무료 체험", value: sub.isTrial ? `체험 중 (종료: ${sub.trialEndDate})` : "아니요" },
            ...(sub.notes ? [{ label: "메모", value: sub.notes }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between px-4 py-3 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleActive(sub.id)}
            className="py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            {sub.isActive ? "일시 중지" : "활성화"}
          </button>
          <Link
            href={`/subscriptions/${sub.id}/edit`}
            className="py-2.5 rounded-xl bg-primary/20 text-primary text-sm font-medium text-center hover:bg-primary/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> 수정
          </Link>
        </div>
        <button
          onClick={handleDelete}
          className="w-full py-2.5 rounded-xl text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> 구독 삭제
        </button>
      </div>
    </>
  );
}
