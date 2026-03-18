"use client";

import { useParams } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Header } from "@/components/layout/header";
import { SubscriptionForm } from "@/components/subscriptions/subscription-form";

export default function EditSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const { subscriptions } = useSubscriptionStore();
  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) return <div className="p-6 text-muted-foreground">구독을 찾을 수 없어요</div>;

  return (
    <>
      <Header title="구독 수정" />
      <SubscriptionForm initial={sub} />
    </>
  );
}
