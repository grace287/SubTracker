"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { generateScenarios, calcTotalPotentialSaving } from "@/lib/savings-engine";
import { formatKRW } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Lightbulb, Users, RefreshCw, Tag, Zap, CreditCard, TrendingDown } from "lucide-react";

const STATIC_TIPS = [
  {
    icon: RefreshCw,
    variant: "info" as const,
    tag: "연간 결제",
    saving: "최대 25% 절약",
    title: "연간 결제로 전환하면 평균 17% 절약",
    desc: "대부분의 서비스는 연간 결제 시 15~25% 할인을 제공합니다. 자주 쓰는 서비스라면 무조건 유리해요.",
  },
  {
    icon: Users,
    variant: "success" as const,
    tag: "가족 공유",
    saving: "1인당 최대 75% 절감",
    title: "가족·친구와 함께 쓰면 1인 비용이 뚝",
    desc: "넷플릭스 스탠다드(17,000원) 4명 공유 시 1인 4,250원. 스포티파이 패밀리(16,350원) 6명 공유 시 1인 2,725원.",
  },
  {
    icon: Tag,
    variant: "warning" as const,
    tag: "학생/직장 할인",
    saving: "최대 50% 할인",
    title: "학생·직장인 할인 꼭 챙기세요",
    desc: "스포티파이 학생(5,450원), Adobe CC 학생(29,000원 vs 일반 60,000원), 유튜브 프리미엄 학생(8,690원) 등 대폭 할인 적용.",
  },
  {
    icon: Zap,
    variant: "warning" as const,
    tag: "무료 체험",
    saving: "체험 기간 100% 무료",
    title: "무료 체험 기간 200% 활용하기",
    desc: "대부분의 서비스는 해지 후 재가입 시 무료 체험을 다시 제공합니다. 이벤트 기간에 맞춰 재가입하면 더 저렴해요.",
  },
  {
    icon: CreditCard,
    variant: "info" as const,
    tag: "카드 캐시백",
    saving: "최대 10% 추가 할인",
    title: "구독 특화 카드로 캐시백 받기",
    desc: "현대카드 ZERO(구독 5% 캐시백), 신한카드 Mr.Life(OTT 5% 적립), 국민카드 노리(넷플릭스/유튜브 할인) 등을 활용하세요.",
  },
  {
    icon: Lightbulb,
    variant: "success" as const,
    tag: "통신사 묶음",
    saving: "월 5,000~20,000원",
    title: "통신사 결합 상품 확인하기",
    desc: "SKT 구독팩(유튜브 프리미엄+웨이브), KT 시즌팩, LGU+ 아이들나라 등 통신사 제휴 묶음 상품이 단독보다 훨씬 저렴할 수 있어요.",
  },
];

const VARIANT_STYLE = {
  warn: "border-l-primary bg-primary/5 dark:bg-primary/10",
  success: "border-l-success bg-success-soft dark:bg-success/10",
  info: "border-l-info bg-info-soft dark:bg-info/10",
  warning: "border-l-warning bg-warning-soft dark:bg-warning/10",
};

export function TipsContent() {
  const { subscriptions } = useSubscriptionStore();
  const scenarios = generateScenarios(subscriptions);
  const totalSaving = calcTotalPotentialSaving(scenarios);

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* AI 분석 결과 요약 */}
      <div className="bg-secondary border border-border rounded-2xl p-5">
        <p className="text-[11px] text-muted-foreground tracking-widest uppercase mb-1">내 구독 분석 결과</p>
        <p className="font-serif text-2xl font-bold leading-tight">
          월 {formatKRW(totalSaving)}<br />
          <span className="text-primary">절약 가능해요</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          아래 팁으로 연간 최대 {formatKRW(totalSaving * 12)} 절약 가능
        </p>
      </div>

      {/* AI 감지된 중복 구독 */}
      {scenarios.filter((s) => s.type === "cancel").map((s, i) => (
        <div key={i} className={cn("border-l-[3px] rounded-xl p-4 space-y-2", VARIANT_STYLE.warn)}>
          <div className="flex items-start gap-2.5">
            <TrendingDown className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm font-bold leading-snug">{s.title}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
          <span className="inline-block font-mono text-xs font-semibold bg-foreground/8 dark:bg-white/10 rounded-full px-3 py-1">
            절약 가능 · {formatKRW(s.monthlySaving)}/월
          </span>
        </div>
      ))}

      {/* 정적 팁 카드 */}
      {STATIC_TIPS.map((tip) => (
        <div
          key={tip.title}
          className={cn("border-l-[3px] rounded-xl p-4 space-y-2", VARIANT_STYLE[tip.variant])}
        >
          <div className="flex items-start gap-2.5">
            <tip.icon className={cn(
              "w-4 h-4 mt-0.5 shrink-0",
              tip.variant === "success" ? "text-success" :
              tip.variant === "warning" ? "text-warning" : "text-info"
            )} />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold",
                  tip.variant === "success" ? "bg-success/15 text-success" :
                  tip.variant === "warning" ? "bg-warning/15 text-warning" : "bg-info/15 text-info"
                )}>
                  {tip.tag}
                </span>
                <span className="text-[10px] text-success font-semibold">{tip.saving}</span>
              </div>
              <p className="text-sm font-bold leading-snug">{tip.title}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-6">{tip.desc}</p>
        </div>
      ))}

      {/* 프로 팁 다크 카드 */}
      <div className="bg-foreground text-background rounded-2xl p-5">
        <p className="text-[10px] opacity-50 tracking-widest uppercase mb-1.5">Pro Tip</p>
        <p className="text-sm font-bold mb-2">체험판 종료일 알림 전략</p>
        <p className="text-xs opacity-60 leading-relaxed">
          무료 체험판 등록 시 종료 3일 전 자동 알림을 설정하면 불필요한 자동 결제를 방지할 수 있어요.
          알림 권한을 허용하면 SubTracker가 자동으로 추적해 드립니다.
        </p>
      </div>
    </div>
  );
}
