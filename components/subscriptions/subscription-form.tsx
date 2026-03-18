"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Subscription, BillingCycle, Category } from "@/types";
import { generateId, calcNextBillingDate, getCategoryLabel } from "@/lib/utils";
import servicesData from "@/data/services.json";
import { ChevronDown, Search } from "lucide-react";

const CATEGORIES: Category[] = [
  "OTT", "music", "cloud", "productivity", "gaming", "education",
  "fitness", "news", "shopping", "other",
];

const COLORS = [
  "#E50914", "#1DB954", "#4285F4", "#8B5CF6", "#107C10",
  "#F59E0B", "#EF4444", "#10A37F", "#FF5733", "#1CB8E0",
  "#E50914", "#0077FF", "#FF153C", "#3478F6",
];

interface Props {
  initial?: Subscription;
}

export function SubscriptionForm({ initial }: Props) {
  const router = useRouter();
  const { addSubscription, updateSubscription } = useSubscriptionStore();

  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? ("OTT" as Category),
    amount: initial?.amount ?? 0,
    billingCycle: initial?.billingCycle ?? ("monthly" as BillingCycle),
    startDate: initial?.startDate ?? new Date().toISOString().split("T")[0],
    isTrial: initial?.isTrial ?? false,
    trialEndDate: initial?.trialEndDate ?? "",
    usageFrequency: initial?.usageFrequency ?? 10,
    color: initial?.color ?? "#8B5CF6",
    notes: initial?.notes ?? "",
  });

  const suggestions = query.length > 0
    ? servicesData.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  function handleSelect(service: typeof servicesData[0]) {
    setForm((f) => ({
      ...f,
      name: service.name,
      category: service.category as Category,
      amount: service.defaultAmount,
      color: service.color,
    }));
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextBillingDate = calcNextBillingDate(form.startDate, form.billingCycle);

    if (initial) {
      updateSubscription(initial.id, { ...form, nextBillingDate });
    } else {
      addSubscription({
        ...form,
        currency: "KRW",
        nextBillingDate,
        isActive: true,
      });
    }
    router.push("/subscriptions");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4 md:p-6 max-w-lg">
      {/* 서비스 검색 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">서비스 검색</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="넷플릭스, 스포티파이..."
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        {suggestions.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
            {suggestions.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent text-left"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: s.color }}
                >
                  {s.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryLabel(s.category as Category)} · 기본 {s.defaultAmount.toLocaleString()}원
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 서비스명 */}
      <Field label="서비스명">
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="서비스명 입력"
          className="input"
        />
      </Field>

      {/* 카테고리 */}
      <Field label="카테고리">
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
          className="input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{getCategoryLabel(c)}</option>
          ))}
        </select>
      </Field>

      {/* 금액 + 주기 */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="결제 금액 (원)">
          <input
            required
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            className="input"
          />
        </Field>
        <Field label="결제 주기">
          <select
            value={form.billingCycle}
            onChange={(e) => setForm((f) => ({ ...f, billingCycle: e.target.value as BillingCycle }))}
            className="input"
          >
            <option value="monthly">월간</option>
            <option value="yearly">연간</option>
            <option value="weekly">주간</option>
          </select>
        </Field>
      </div>

      {/* 시작일 */}
      <Field label="구독 시작일">
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          className="input"
        />
      </Field>

      {/* 사용 빈도 */}
      <Field label={`월 사용 빈도: ${form.usageFrequency}회`}>
        <input
          type="range"
          min={1}
          max={60}
          value={form.usageFrequency}
          onChange={(e) => setForm((f) => ({ ...f, usageFrequency: Number(e.target.value) }))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>거의 안 씀</span>
          <span>매일</span>
        </div>
      </Field>

      {/* 무료 체험 */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="trial"
          checked={form.isTrial}
          onChange={(e) => setForm((f) => ({ ...f, isTrial: e.target.checked }))}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="trial" className="text-sm font-medium">무료 체험 중</label>
      </div>
      {form.isTrial && (
        <Field label="체험 종료일">
          <input
            type="date"
            value={form.trialEndDate}
            onChange={(e) => setForm((f) => ({ ...f, trialEndDate: e.target.value }))}
            className="input"
          />
        </Field>
      )}

      {/* 메모 */}
      <Field label="메모 (선택)">
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={2}
          placeholder="추가 메모..."
          className="input resize-none"
        />
      </Field>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
      >
        {initial ? "수정 완료" : "구독 추가"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
