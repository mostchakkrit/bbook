import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/api";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { AdminNav } from "@/components/admin-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomForm } from "../room-form";
import { createRoomAction } from "../actions";

export default async function NewRoomPage() {
  const [currentUser, session] = await Promise.all([
    getCurrentUser(),
    getSession(),
  ]);
  if (!session) redirect("/login");

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
          <p className="text-sm text-muted-foreground">เพิ่มห้องประชุมใหม่</p>
        </div>

        <AdminNav />

        <Card>
          <CardHeader>
            <CardTitle>เพิ่มห้องใหม่</CardTitle>
            <CardDescription>กรอกรายละเอียดห้องประชุม</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm action={createRoomAction} submitLabel="เพิ่มห้อง" />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
