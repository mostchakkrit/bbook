"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { linkLineAction } from "./action";
import { AuthShell } from "@/components/auth-shell";
import { cn } from "@/lib/utils";

type Status = {
  kind: "loading" | "success" | "error";
  message: string;
};

export default function LiffLinkPage() {
  const [status, setStatus] = useState<Status>({
    kind: "loading",
    message: "กำลังเชื่อมต่อ LINE...",
  });

  useEffect(() => {
    async function run() {
      try {
        const { default: liff } = await import("@line/liff");
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const idToken = liff.getIDToken();
        if (!idToken) {
          setStatus({ kind: "error", message: "ไม่สามารถดึงข้อมูล LINE ได้" });
          return;
        }
        const result = await linkLineAction(idToken);
        if (result.error) {
          setStatus({ kind: "error", message: result.error });
        } else {
          setStatus({ kind: "success", message: "ผูกบัญชี LINE สำเร็จ" });
        }
      } catch (err) {
        console.error("LIFF error:", err);
        setStatus({
          kind: "error",
          message: `เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }
    run();
  }, []);

  return (
    <AuthShell
      title="เชื่อมต่อ LINE"
      description="รับการแจ้งเตือนผลการจองผ่าน LINE"
    >
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        {status.kind === "loading" && (
          <Loader2 className="size-8 animate-spin text-primary" />
        )}
        {status.kind === "success" && (
          <CheckCircle2 className="size-8 text-success" />
        )}
        {status.kind === "error" && (
          <AlertCircle className="size-8 text-destructive" />
        )}
        <p
          className={cn(
            "text-sm",
            status.kind === "success" && "text-success",
            status.kind === "error" && "text-destructive",
            status.kind === "loading" && "text-muted-foreground",
          )}
        >
          {status.message}
        </p>
      </div>
    </AuthShell>
  );
}
