"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

export default function Calendar24({
  date,
  setDate,
  time,
  setTime,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex gap-4 mt-3">
      <div className="flex flex-col gap-2">
        <Label>Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="w-32 justify-between" type="button">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={date => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Time</Label>
      
        <Input
          type="time"

          value={time} onChange={e => setTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
