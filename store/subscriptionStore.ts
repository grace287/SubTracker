"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Subscription, Category } from "@/types";
import { generateId, calcNextBillingDate } from "@/lib/utils";

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (data: Omit<Subscription, "id" | "createdAt">) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleActive: (id: string) => void;
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
    nextBillingDate: new Date(new Date().setDate(15)).toISOString().split("T")[0],
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
    nextBillingDate: new Date(new Date().setDate(10)).toISOString().split("T")[0],
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
    nextBillingDate: new Date(new Date().setDate(20)).toISOString().split("T")[0],
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
    nextBillingDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
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
    (set) => ({
      subscriptions: SAMPLE_DATA,

      addSubscription: (data) =>
        set((state) => ({
          subscriptions: [
            ...state.subscriptions,
            {
              ...data,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateSubscription: (id, data) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),

      deleteSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        })),

      toggleActive: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s
          ),
        })),
    }),
    {
      name: "subtracker-storage",
    }
  )
);
