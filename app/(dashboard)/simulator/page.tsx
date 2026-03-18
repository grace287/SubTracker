"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Header } from "@/components/layout/header";
import { generateScenarios, calcTotalPotentialSaving } from "@/lib/savings-engine";
import { formatKRW } from "@/lib/utils";
import { TrendingDown, X, RefreshCw, ArrowLeftRight, MinusCircle } from "lucide-react";

const TYPE_ICON = {
  cancel: MinusCircle,
  downgrade: TrendingDown,
  share: RefreshCw,
  switch: ArrowLeftRight,
};

const TYPE_LABEL = {
  cancel: "해지",
  downgrade: "다운그레이드",
  share: "공유",
  switch: "전환",
};

const TYPE_COLOR = {
  cancel: "text-red-400 bg-red-400/10",
  downgrade: "text-orange-400 bg-orange-400/10",
  share: "text-blue-400 bg-blue-400/10",
  switch: "text-purple-400 bg-purple-400/10",
};

export default function SimulatorPage() {
  const { subscriptions } = useSubscriptionStore();
  const scenarios = generateScenarios(subscriptions);
  const totalSaving = calcTotalPotentialSaving(scenarios);

  return (
    <>
      <Header title="절약 시뮬레이터" subtitle="지금 바꾸면 얼마를 아낄 수 있을까?" />
      <div className="p-4 md:p-6 space-y-4">
        {/* 총 절약 가능액 */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">절약 가능 금액</p>
          <p className="text-4xl font-bold text-primary mt-1">{formatKRW(totalSaving)}<span className="text-lg">/월</span></p>
          <p className="text-sm text-muted-foreground mt-1">연간 최대 {formatKRW(totalSaving * 12)} 절약 가능</p>
        </div>

        {scenarios.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>현재 절약 시나리오가 없어요</p>
            <p className="text-sm mt-1">구독을 더 추가하면 분석이 시작돼요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scenarios.map((s, i) => {
              const Icon = TYPE_ICON[s.type];
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLOR[s.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{s.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[s.type]}`}>
                          {TYPE_LABEL[s.type]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-xs text-muted-foreground">월 절약</p>
                      <p className="font-bold text-green-400">{formatKRW(s.monthlySaving)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">연간 절약</p>
                      <p className="font-bold text-green-400">{formatKRW(s.yearlySaving)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
