"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { registerAction } from "./action";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <AuthShell
      title="สมัครสมาชิก"
      description="สร้างบัญชีเพื่อเริ่มจองห้องประชุม"
      footer={
        <>
          มีบัญชีแล้ว?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">ชื่อ</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">นามสกุล</Label>
            <Input id="lastName" name="lastName" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">อีเมล</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
          />
        </div>
        {state?.error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </Button>
      </form>
    </AuthShell>
  );
}
