"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, DoorOpen, LogOut, MessageCircle } from "lucide-react";

import { logoutAction } from "@/app/logout-action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "ห้องประชุม", icon: DoorOpen },
  { href: "/bookings", label: "การจองของฉัน", icon: CalendarDays },
  { href: "/liff-link", label: "เชื่อมต่อ LINE", icon: MessageCircle },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <DoorOpen className="size-4" />
          </span>
          <span className="hidden sm:inline">ระบบจองห้องประชุม</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-3",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <form action={logoutAction} className="shrink-0">
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="text-muted-foreground"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
