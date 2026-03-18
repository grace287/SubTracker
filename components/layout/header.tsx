"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-bold">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <Link
        href="/subscriptions/add"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">구독 추가</span>
      </Link>
    </header>
  );
}
