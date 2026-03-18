"use client";

import { useEffect, useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import {
  checkPaymentAlerts,
  getAlertCount,
  getNotificationPermission,
  requestNotificationPermission,
  NotificationPermission,
} from "@/lib/notifications";

export function useNotifications() {
  const { subscriptions } = useSubscriptionStore();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const alertCount = getAlertCount(subscriptions);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  useEffect(() => {
    if (permission === "granted") {
      checkPaymentAlerts(subscriptions);
    }
  }, [subscriptions, permission]);

  async function requestPermission() {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      checkPaymentAlerts(subscriptions);
    }
    return result;
  }

  return { permission, alertCount, requestPermission };
}
