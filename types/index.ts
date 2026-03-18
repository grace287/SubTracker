export type BillingCycle = "weekly" | "monthly" | "yearly";
export type Category =
  | "OTT"
  | "music"
  | "cloud"
  | "productivity"
  | "gaming"
  | "education"
  | "fitness"
  | "news"
  | "shopping"
  | "other";

export type ValueGrade = "A" | "B" | "C" | "D" | "F";

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  amount: number;
  currency: "KRW" | "USD";
  billingCycle: BillingCycle;
  startDate: string; // ISO date string
  nextBillingDate: string;
  isTrial: boolean;
  trialEndDate?: string;
  usageFrequency: number; // times per month
  color: string;
  icon?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ValueScore {
  score: number; // 0~100
  grade: ValueGrade;
  costPerUse: number;
  label: string;
}

export interface SavingsTip {
  id: string;
  category: Category | "general";
  title: string;
  description: string;
  savingAmount?: number;
  tag: "plan" | "share" | "trial" | "discount" | "alternative";
}

export interface SimulatorScenario {
  title: string;
  description: string;
  monthlySaving: number;
  yearlySaving: number;
  type: "downgrade" | "cancel" | "share" | "switch";
  subscriptionIds: string[];
}

export interface AnalyticsSummary {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
  trialCount: number;
  categoryBreakdown: { category: Category; amount: number; count: number }[];
  upcomingThisWeek: Subscription[];
}
