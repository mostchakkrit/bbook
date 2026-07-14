"use client"

import * as React from "react"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const dateLabelFormatter = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function toDateOnly(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function DateTimeField({
  name,
  required,
  minDate,
  defaultValue,
}: {
  name: string
  required?: boolean
  minDate?: Date
  defaultValue?: string
}) {
  const initial = defaultValue ? new Date(defaultValue) : undefined
  const [date, setDate] = React.useState<Date | undefined>(initial)
  const [time, setTime] = React.useState(
    initial
      ? `${String(initial.getHours()).padStart(2, "0")}:${String(initial.getMinutes()).padStart(2, "0")}`
      : ""
  )
  const [open, setOpen] = React.useState(false)

  const combined =
    date && time
      ? `${toDateOnly(date.getFullYear(), date.getMonth() + 1, date.getDate())}T${time}`
      : "";

  return (
    <div className="flex gap-1.5">
      <input type="hidden" name={name} value={combined} required={required} />
      <Popover open={open} onOpenChange={(value) => setOpen(value)}>
        <PopoverTrigger
          className={cn(
            "flex h-8 flex-1 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
          {date ? dateLabelFormatter.format(date) : "ว/ด/ป"}
        </PopoverTrigger>
        <PopoverContent align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => {
              setDate(value);
              if (value) setOpen(false);
            }}
            disabled={minDate ? { before: minDate } : undefined}
            defaultMonth={date ?? minDate}
          />
        </PopoverContent>
      </Popover>
      <div className="relative w-28 shrink-0">
        <Clock className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  )
}
