import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Subscription } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase 미설정 시 null 반환 (로컬 스토리지 폴백)
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const isSupabaseEnabled = Boolean(supabase);

// ── 인증 헬퍼 ─────────────────────────────────────────────
export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// ── 구독 CRUD ──────────────────────────────────────────────
export async function fetchSubscriptions(userId: string): Promise<Subscription[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(dbToSubscription);
}

export async function upsertSubscription(sub: Subscription, userId: string) {
  if (!supabase) return;
  const { error } = await supabase
    .from("subscriptions")
    .upsert({ ...subscriptionToDb(sub), user_id: userId }, { onConflict: "id" });
  if (error) throw error;
}

export async function deleteSubscriptionDb(id: string) {
  if (!supabase) return;
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  if (error) throw error;
}

// ── 타입 변환 ──────────────────────────────────────────────
function subscriptionToDb(sub: Subscription) {
  return {
    id: sub.id,
    name: sub.name,
    category: sub.category,
    amount: sub.amount,
    currency: sub.currency,
    billing_cycle: sub.billingCycle,
    start_date: sub.startDate,
    next_billing_date: sub.nextBillingDate,
    is_trial: sub.isTrial,
    trial_end_date: sub.trialEndDate ?? null,
    usage_frequency: sub.usageFrequency,
    color: sub.color,
    notes: sub.notes ?? null,
    is_active: sub.isActive,
    created_at: sub.createdAt,
  };
}

function dbToSubscription(row: Record<string, unknown>): Subscription {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Subscription["category"],
    amount: row.amount as number,
    currency: row.currency as "KRW" | "USD",
    billingCycle: row.billing_cycle as Subscription["billingCycle"],
    startDate: row.start_date as string,
    nextBillingDate: row.next_billing_date as string,
    isTrial: row.is_trial as boolean,
    trialEndDate: (row.trial_end_date as string) ?? undefined,
    usageFrequency: row.usage_frequency as number,
    color: row.color as string,
    notes: (row.notes as string) ?? undefined,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
  };
}
