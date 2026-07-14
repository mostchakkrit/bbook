import { MapPin, Presentation, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { apiFetchAuth, getCurrentUser } from "@/lib/api";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingForm } from "./booking-form";

const AMENITY_LABELS: Record<string, string> = {
  projector: "มีจอโปรเจคเตอร์",
  whiteboard: "ไวท์บอร์ด",
};

export default async function HomePage() {
  const [res, currentUser, session] = await Promise.all([
    apiFetchAuth("/room"),
    getCurrentUser(),
    getSession(),
  ]);
  if (!res.ok) {
    redirect("/login");
  }
  const rooms = await res.json();

  return (
    <>
      <SiteHeader
        lineLinked={!!currentUser?.lineUserId}
        isAdmin={session?.role === "admin"}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-10 px-4 py-10 sm:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            ห้องประชุม
          </h1>
          <p className="text-sm text-muted-foreground">
            เลือกห้องและช่วงเวลาที่ต้องการจอง
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {rooms.map((room: any) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {room.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    จุได้ {room.capacity} คน
                  </span>
                </CardDescription>
                {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {room.amenities.map((amenity: string) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {amenity === "projector" && (
                          <Presentation className="size-3.5" />
                        )}
                        {AMENITY_LABELS[amenity] ?? amenity}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>จองห้องประชุม</CardTitle>
            <CardDescription>
              กรอกรายละเอียดเพื่อส่งคำขอจอง — ต้องรอการอนุมัติจากแอดมิน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm rooms={rooms} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
