import { Header } from "@/components/layout/header";
import { TipsContent } from "@/components/tips/tips-content";

export default function TipsPage() {
  return (
    <>
      <Header title="절약 팁" subtitle="구독비 줄이는 방법 모음" />
      <TipsContent />
    </>
  );
}
