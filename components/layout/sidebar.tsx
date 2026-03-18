"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Calculator,
  Lightbulb,
  Settings,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { href: "/subscriptions", icon: CreditCard, label: "구독 목록" },
  { href: "/analytics", icon: BarChart3, label: "지출 분석" },
  { href: "/simulator", icon: Calculator, label: "절약 시뮬레이터" },
  { href: "/tips", icon: Lightbulb, label: "절약 팁" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-card h-screen sticky top-0">
      {/* 로고 */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-serif font-bold text-base leading-none tracking-tight">SubTracker</p>
            <p className="text-[9px] text-muted-foreground tracking-widest uppercase mt-0.5">Subscription Wallet</p>
          </div>
        </div>
        <ThemeToggle className="w-7 h-7" />
      </div>

      {/* 네비 */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary/12 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 하단 */}
      <div className="px-3 pb-4 border-t border-border pt-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
        >
          <Settings className="w-4 h-4 shrink-0" />
          설정
        </Link>
      </div>
    </aside>
  );
}
