import { notFound, redirect } from "next/navigation";

import { apiFetchAuth, getCurrentUser } from "@/lib/api";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { AdminNav } from "@/components/admin-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomForm } from "../../room-form";
import { updateRoomAction } from "../../actions";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [res, currentUser, session] = await Promise.all([
    apiFetchAuth(`/room/${id}`),
    getCurrentUser(),
    getSession(),
  ]);
  if (!session) redirect("/login");
  if (res.status === 404) notFound();
  if (!res.ok) redirect("/admin/rooms");
  const room = await res.json();

  return (
    <>
      <SiteHeader
        lineLinked={!!currentUser?.lineUserId}
        isAdmin={session.role === "admin"}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10 sm:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            จัดการระบบ
          </h1>
          <p className="text-sm text-muted-foreground">แก้ไขห้องประชุม</p>
        </div>

        <AdminNav />

        <Card>
          <CardHeader>
            <CardTitle>แก้ไข {room.name}</CardTitle>
            <CardDescription>อัปเดตรายละเอียดห้องประชุม</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm
              action={updateRoomAction.bind(null, id)}
              room={room}
              submitLabel="บันทึกการแก้ไข"
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
