import { CalendarClock } from "lucide-react";
import { redirect } from "next/navigation";

import { apiFetchAuth } from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cancelBookingAction } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("approve") || s.includes("confirm")) {
    return <Badge variant="success">อนุมัติแล้ว</Badge>;
  }
  if (s.includes("reject")) {
    return <Badge variant="destructive">ถูกปฏิเสธ</Badge>;
  }
  if (s.includes("cancel")) {
    return <Badge variant="secondary">ยกเลิกแล้ว</Badge>;
  }
  return <Badge variant="warning">รออนุมัติ</Badge>;
}

export default async function BookingsPage() {
  const res = await apiFetchAuth("/book");
  if (!res.ok) redirect("/login");
  const { data: bookings } = await res.json();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10 sm:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            การจองของฉัน
          </h1>
          <p className="text-sm text-muted-foreground">
            รายการคำขอจองห้องประชุมทั้งหมดของคุณ
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              ยังไม่มีรายการจอง
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: any) => (
              <Card key={b.id}>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {b.room.name}
                      </p>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarClock className="size-3.5 shrink-0" />
                      {new Date(b.startTime).toLocaleString("th-TH")} -{" "}
                      {new Date(b.endTime).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <form
                    action={cancelBookingAction.bind(null, b.id)}
                    className="shrink-0"
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      ยกเลิก
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
