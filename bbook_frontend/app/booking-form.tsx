"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { createBookingAction } from "./book-actions";
import { Button } from "@/components/ui/button";
import { DateTimeField } from "@/components/ui/date-time-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BookingForm({ rooms }: { rooms: any[] }) {
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    null,
  );
  const roomNameById = Object.fromEntries(rooms.map((r) => [r.id, r.name]));

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="roomId">ห้อง</Label>
        <Select name="roomId" required>
          <SelectTrigger id="roomId" className="w-full">
            <SelectValue placeholder="เลือกห้อง">
              {(value: string) => roomNameById[value] ?? "เลือกห้อง"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>เวลาเริ่ม</Label>
          <DateTimeField name="startTime" required minDate={new Date()} />
        </div>
        <div className="space-y-1.5">
          <Label>เวลาสิ้นสุด</Label>
          <DateTimeField name="endTime" required minDate={new Date()} />
        </div>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          ส่งคำขอจองสำเร็จ รอการอนุมัติจากแอดมิน
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "กำลังจอง..." : "จองห้อง"}
      </Button>
    </form>
  );
}
