import { redirect } from "next/navigation";

// Route handled by app/(dashboard)/dashboard/page.tsx
export default function Page() {
  redirect("/dashboard");
}
