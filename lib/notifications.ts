"use client";

import { Subscription } from "@/types";
import { getDaysUntilBilling } from "./utils";

export type NotificationPermission = "granted" | "denied" | "default";

// ── 권한 요청 ──────────────────────────────────────────────
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") return "granted";
  const result = await Notification.requestPermission();
  return result;
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  return Notification.permission;
}

// ── 알림 발송 ──────────────────────────────────────────────
function notify(title: string, body: string, tag?: string) {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      tag,
      icon: "/icon-192.png",
    });
  } catch (e) {
    console.warn("Notification failed:", e);
  }
}

// ── 결제 알림 체크 ─────────────────────────────────────────
export function checkPaymentAlerts(subscriptions: Subscription[]) {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;

  const ALERT_KEY = "subtracker-last-alert";
  const today = new Date().toISOString().split("T")[0];
  const lastAlert = localStorage.getItem(ALERT_KEY);

  // 하루 1번만 체크
  if (lastAlert === today) return;
  localStorage.setItem(ALERT_KEY, today);

  const active = subscriptions.filter((s) => s.isActive);

  active.forEach((sub) => {
    const days = getDaysUntilBilling(sub.nextBillingDate);

    if (days === 0) {
      notify(
        `💳 오늘 결제 예정`,
        `${sub.name} ${sub.amount.toLocaleString()}원이 오늘 결제됩니다.`,
        `billing-today-${sub.id}`
      );
    } else if (days === 3) {
      notify(
        `⏰ 3일 후 결제 예정`,
        `${sub.name} ${sub.amount.toLocaleString()}원 — 3일 뒤 결제됩니다.`,
        `billing-d3-${sub.id}`
      );
    } else if (days === 7) {
      notify(
        `📅 1주일 후 결제 예정`,
        `${sub.name} ${sub.amount.toLocaleString()}원 — 7일 뒤 결제됩니다.`,
        `billing-d7-${sub.id}`
      );
    }

    // 무료 체험 종료 알림
    if (sub.isTrial && sub.trialEndDate) {
      const trialDays = Math.ceil(
        (new Date(sub.trialEndDate).getTime() - Date.now()) / 86400000
      );
      if (trialDays === 3) {
        notify(
          `⚠️ 무료 체험 종료 임박`,
          `${sub.name} 체험판이 3일 후 종료됩니다. 해지를 원하면 미리 확인하세요.`,
          `trial-${sub.id}`
        );
      }
    }
  });
}

// ── 알림 설정 저장/로드 ────────────────────────────────────
export interface NotificationSettings {
  enabled: boolean;
  daysBeforeD7: boolean;
  daysBeforeD3: boolean;
  daysBeforeD0: boolean;
  trialAlert: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  daysBeforeD7: true,
  daysBeforeD3: true,
  daysBeforeD0: true,
  trialAlert: true,
};

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem("subtracker-notification-settings");
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem("subtracker-notification-settings", JSON.stringify(settings));
}

// ── 알림 배지 카운트 (헤더용) ─────────────────────────────
export function getAlertCount(subscriptions: Subscription[]): number {
  const active = subscriptions.filter((s) => s.isActive);
  let count = 0;
  active.forEach((sub) => {
    const days = getDaysUntilBilling(sub.nextBillingDate);
    if (days >= 0 && days <= 7) count++;
    if (sub.isTrial && sub.trialEndDate) {
      const trialDays = Math.ceil(
        (new Date(sub.trialEndDate).getTime() - Date.now()) / 86400000
      );
      if (trialDays >= 0 && trialDays <= 3) count++;
    }
  });
  return count;
}
