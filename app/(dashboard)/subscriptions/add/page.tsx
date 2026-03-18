import { Header } from "@/components/layout/header";
import { SubscriptionForm } from "@/components/subscriptions/subscription-form";

export default function AddSubscriptionPage() {
  return (
    <>
      <Header title="구독 추가" />
      <SubscriptionForm />
    </>
  );
}
