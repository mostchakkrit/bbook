"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, DoorOpen } from "lucide-react";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "คำขอจอง", icon: CalendarClock },
  { href: "/admin/rooms", label: "ห้องประชุม", icon: DoorOpen },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-border">
      {adminNavItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
