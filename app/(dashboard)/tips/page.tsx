import { Header } from "@/components/layout/header";
import { Lightbulb, Users, RefreshCw, Tag, Zap, CreditCard } from "lucide-react";

const TIPS = [
  {
    icon: RefreshCw,
    tag: "연간 결제",
    color: "text-blue-400 bg-blue-400/10",
    title: "연간 결제로 전환하면 평균 17% 절약",
    desc: "대부분의 구독 서비스는 연간 결제 시 월결제 대비 15~25% 할인을 제공합니다. 자주 쓰는 서비스라면 무조건 유리해요.",
    saving: "연간 최대 25% 절약",
  },
  {
    icon: Users,
    tag: "가족 공유",
    color: "text-green-400 bg-green-400/10",
    title: "가족/친구와 함께 쓰면 1인 비용이 뚝",
    desc: "넷플릭스 스탠다드(17,000원) 4명 공유 시 1인 4,250원. 스포티파이 패밀리(16,350원) 6명 공유 시 1인 2,725원.",
    saving: "1인당 최대 75% 절감",
  },
  {
    icon: Tag,
    tag: "학생/직장 할인",
    color: "text-purple-400 bg-purple-400/10",
    title: "학생·직장인 할인 꼭 챙기세요",
    desc: "스포티파이 학생 요금제(5,450원), Adobe CC 학생(29,000원/월 vs 일반 60,000원), 유튜브 프리미엄 학생(8,690원) 등 대폭 할인 적용.",
    saving: "최대 50% 할인",
  },
  {
    icon: Zap,
    tag: "무료 체험 활용",
    color: "text-yellow-400 bg-yellow-400/10",
    title: "무료 체험 기간 200% 활용하기",
    desc: "대부분의 서비스는 해지 후 재가입 시 무료 체험을 다시 제공합니다. 이벤트 기간에 맞춰 재가입하면 더 저렴하게 이용 가능해요.",
    saving: "체험 기간 동안 100% 무료",
  },
  {
    icon: CreditCard,
    tag: "카드 캐시백",
    color: "text-orange-400 bg-orange-400/10",
    title: "구독 특화 카드로 캐시백 받기",
    desc: "현대카드 ZERO(구독 5% 캐시백), 신한카드 Mr.Life(OTT 5% 적립), 국민카드 노리(넷플릭스/유튜브 할인) 등을 활용하면 추가 절약이 가능해요.",
    saving: "최대 10% 추가 할인",
  },
  {
    icon: Lightbulb,
    tag: "묶음 구독",
    color: "text-cyan-400 bg-cyan-400/10",
    title: "통신사 결합 상품 확인하기",
    desc: "SKT 구독팩(유튜브 프리미엄+웨이브), KT 시즌팩, LGU+ 아이들나라 등 통신사 제휴 묶음 상품이 단독 가입보다 훨씬 저렴할 수 있어요.",
    saving: "월 5,000~20,000원 절약",
  },
];

export default function TipsPage() {
  return (
    <>
      <Header title="절약 팁" subtitle="구독비 줄이는 방법 모음" />
      <div className="p-4 md:p-6 space-y-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tip.color}`}>
                <tip.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tip.color}`}>
                    {tip.tag}
                  </span>
                  <span className="text-xs text-green-400 font-medium">{tip.saving}</span>
                </div>
                <p className="text-sm font-semibold mt-1">{tip.title}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-12">{tip.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
