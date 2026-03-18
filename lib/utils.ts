import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BillingCycle, Category } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function toMonthlyAmount(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":
      return Math.round(amount * 4.33);
    case "monthly":
      return amount;
    case "yearly":
      return Math.round(amount / 12);
  }
}

export function toYearlyAmount(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":
      return Math.round(amount * 52);
    case "monthly":
      return amount * 12;
    case "yearly":
      return amount;
  }
}

export function getDaysUntilBilling(nextBillingDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const billing = new Date(nextBillingDate);
  billing.setHours(0, 0, 0, 0);
  return Math.ceil((billing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getUsageDuration(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (months < 1) return "1개월 미만";
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}년 ${rem}개월` : `${years}년`;
}

export function getCategoryLabel(category: Category): string {
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

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    OTT: "#E50914",
    music: "#1DB954",
    cloud: "#4285F4",
    productivity: "#8B5CF6",
    gaming: "#107C10",
    education: "#F59E0B",
    fitness: "#EF4444",
    news: "#6B7280",
    shopping: "#1CB8E0",
    other: "#94A3B8",
  };
  return map[category] ?? "#94A3B8";
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function calcNextBillingDate(fromDate: string, cycle: BillingCycle): string {
  const date = new Date(fromDate);
  switch (cycle) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().split("T")[0];
}
