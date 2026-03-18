"use client";

import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  serif?: boolean;
}

export function Header({ title, subtitle, serif = false }: HeaderProps) {
  const { alertCount, permission, requestPermission } = useNotifications();

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div>
        <h1
          className={cn(
            "text-lg font-bold leading-tight",
            serif && "font-serif text-xl"
          )}
        >
          {title}
        </h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* 알림 버튼 */}
        <button
          onClick={permission !== "granted" ? requestPermission : undefined}
          aria-label="알림"
          className="relative w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:bg-accent transition-all"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
          {permission === "default" && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-warning border-2 border-card" />
          )}
        </button>

        {/* 테마 토글 */}
        <ThemeToggle />

        {/* 구독 추가 */}
        <Link
          href="/subscriptions/add"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">추가</span>
        </Link>
      </div>
    </header>
  );
}
