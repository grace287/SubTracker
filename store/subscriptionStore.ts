"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Subscription } from "@/types";
import { generateId, calcNextBillingDate } from "@/lib/utils";
import {
  supabase,
  fetchSubscriptions,
  upsertSubscription,
  deleteSubscriptionDb,
} from "@/lib/supabase";

interface SubscriptionStore {
  subscriptions: Subscription[];
  isSyncing: boolean;
  // CRUD
  addSubscription: (data: Omit<Subscription, "id" | "createdAt">) => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  toggleActive: (id: string) => void;
  // Supabase sync
  syncFromSupabase: () => Promise<void>;
}

const SAMPLE_DATA: Subscription[] = [
  {
    id: "sample-1",
    name: "넷플릭스",
    category: "OTT",
    amount: 17000,
    currency: "KRW",
    billingCycle: "monthly",
    startDate: "2022-06-01",
    nextBillingDate: new Date(new Date().setDate(21)).toISOString().split("T")[0],
    isTrial: false,
    usageFrequency: 20,
    color: "#E50914",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    name: "스포티파이",
    category: "music",
    amount: 10900,
    currency: "KRW",
    billingCycle: "monthly",
    startDate: "2023-01-10",
    nextBillingDate: new Date(new Date().setDate(28)).toISOString().split("T")[0],
    isTrial: false,
    usageFrequency: 25,
    color: "#1DB954",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-3",
    name: "유튜브 프리미엄",
    category: "OTT",
    amount: 14900,
    currency: "KRW",
    billingCycle: "monthly",
    startDate: "2021-03-20",
    nextBillingDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
    isTrial: false,
    usageFrequency: 30,
    color: "#FF0000",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-4",
    name: "ChatGPT Plus",
    category: "productivity",
    amount: 27000,
    currency: "KRW",
    billingCycle: "monthly",
    startDate: "2024-01-01",
    nextBillingDate: new Date(new Date().setDate(17)).toISOString().split("T")[0],
    isTrial: false,
    usageFrequency: 15,
    color: "#10A37F",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-5",
    name: "iCloud",
    category: "cloud",
    amount: 1200,
    currency: "KRW",
    billingCycle: "monthly",
    startDate: "2020-09-01",
    nextBillingDate: new Date(new Date().setDate(5)).toISOString().split("T")[0],
    isTrial: false,
    usageFrequency: 30,
    color: "#3478F6",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-6",
    name: "티빙",
    category: "OTT",
    amount: 7900,
    currency: "KRW",
    billingCycle: "monthly",
    startDate: "2024-06-01",
    nextBillingDate: new Date(new Date().setDate(8)).toISOString().split("T")[0],
    isTrial: false,
    usageFrequency: 3,
    color: "#FF153C",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: SAMPLE_DATA,
      isSyncing: false,

      addSubscription: async (data) => {
        const newSub: Subscription = {
          ...data,
          id: generateId(),
          nextBillingDate: calcNextBillingDate(data.startDate, data.billingCycle),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ subscriptions: [...state.subscriptions, newSub] }));

        // Supabase 동기화 (선택적)
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) await upsertSubscription(newSub, user.id);
        }
      },

      updateSubscription: async (id, data) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));

        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const updated = get().subscriptions.find((s) => s.id === id);
            if (updated) await upsertSubscription(updated, user.id);
          }
        }
      },

      deleteSubscription: async (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }));

        if (supabase) {
          await deleteSubscriptionDb(id);
        }
      },

      toggleActive: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s
          ),
        }));
      },

      // Supabase에서 전체 동기화
      syncFromSupabase: async () => {
        if (!supabase) return;
        set({ isSyncing: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const remote = await fetchSubscriptions(user.id);
          if (remote.length > 0) {
            set({ subscriptions: remote });
          }
        } catch (e) {
          console.error("Supabase sync failed:", e);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "subtracker-storage",
    }
  )
);
