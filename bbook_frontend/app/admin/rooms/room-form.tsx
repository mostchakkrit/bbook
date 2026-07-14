"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AMENITY_OPTIONS = [
  { value: "projector", label: "จอโปรเจคเตอร์" },
  { value: "whiteboard", label: "ไวท์บอร์ด" },
];

type Room = {
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
};

export function RoomForm({
  action,
  room,
  submitLabel,
}: {
  action: (prevState: any, formData: FormData) => Promise<{ error?: string }>;
  room?: Room;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">ชื่อห้อง</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={room?.name}
            placeholder="Meeting Room A"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="capacity">ความจุ (คน)</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            required
            defaultValue={room?.capacity}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="location">ตำแหน่งที่ตั้ง</Label>
          <Input
            id="location"
            name="location"
            required
            defaultValue={room?.location}
            placeholder="Floor 1"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>สิ่งอำนวยความสะดวก</Label>
        <div className="flex flex-wrap gap-4">
          {AMENITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="amenities"
                value={opt.value}
                defaultChecked={room?.amenities?.includes(opt.value)}
                className="size-4 rounded border-input accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "กำลังบันทึก..." : submitLabel}
      </Button>
    </form>
  );
}
