import Link from "next/link";
import { MapPin, Pencil, Plus, Presentation, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { apiFetchAuth, getCurrentUser } from "@/lib/api";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { AdminNav } from "@/components/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteRoomAction } from "./actions";
import type { Room } from "@/lib/types";

const AMENITY_LABELS: Record<string, string> = {
  projector: "มีจอโปรเจคเตอร์",
  whiteboard: "ไวท์บอร์ด",
};

export default async function AdminRoomsPage() {
  const [res, currentUser, session] = await Promise.all([
    apiFetchAuth("/room"),
    getCurrentUser(),
    getSession(),
  ]);
  if (!res.ok) redirect("/login");
  const rooms = await res.json();

  return (
    <>
      <SiteHeader
        lineLinked={!!currentUser?.lineUserId}
        isAdmin={session?.role === "admin"}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              จัดการระบบ
            </h1>
            <p className="text-sm text-muted-foreground">
              ห้องประชุมทั้งหมด
            </p>
          </div>
          <Link
            href="/admin/rooms/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" />
            เพิ่มห้องใหม่
          </Link>
        </div>

        <AdminNav />

        {rooms.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              ยังไม่มีห้องประชุม
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rooms.map((room: Room) => (
              <Card key={room.id}>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <p className="font-medium text-foreground">{room.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {room.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        จุได้ {room.capacity} คน
                      </span>
                    </div>
                    {Array.isArray(room.amenities) &&
                      room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
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
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/rooms/${room.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <Pencil className="size-4" />
                      แก้ไข
                    </Link>
                    <form action={deleteRoomAction.bind(null, room.id)}>
                      <Button variant="destructive" size="sm" type="submit">
                        ลบ
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
