import { CalendarClock } from "lucide-react";
import { redirect } from "next/navigation";

import { apiFetchAuth, getCurrentUser } from "@/lib/api";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateBookingStatusAction } from "./actions";
import type { Booking } from "@/lib/types";

export default async function AdminBookingsPage() {
  const [res, currentUser, session] = await Promise.all([
    apiFetchAuth("/book/pending"),
    getCurrentUser(),
    getSession(),
  ]);
  if (!res.ok) redirect("/login");
  const { data: bookings } = await res.json();

  return (
    <>
      <SiteHeader
        lineLinked={!!currentUser?.lineUserId}
        isAdmin={session?.role === "admin"}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10 sm:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            จัดการระบบ
          </h1>
          <p className="text-sm text-muted-foreground">
            คำขอจองที่รออนุมัติ
          </p>
        </div>

        <AdminNav />

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              ไม่มีคำขอจองที่รออนุมัติ
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: Booking) => (
              <Card key={b.id}>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <p className="font-medium text-foreground">
                      {b.room.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.user.firstName} {b.user.lastName} ({b.user.email})
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarClock className="size-3.5 shrink-0" />
                      {new Date(b.startTime).toLocaleString("th-TH")} -{" "}
                      {new Date(b.endTime).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <form
                      action={updateBookingStatusAction.bind(
                        null,
                        b.id,
                        "REJECTED"
                      )}
                    >
                      <Button variant="destructive" size="sm" type="submit">
                        ปฏิเสธ
                      </Button>
                    </form>
                    <form
                      action={updateBookingStatusAction.bind(
                        null,
                        b.id,
                        "APPROVED"
                      )}
                    >
                      <Button size="sm" type="submit">
                        อนุมัติ
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
