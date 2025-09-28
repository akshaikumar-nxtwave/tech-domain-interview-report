"use client"

import * as React from "react"

import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { PanelTopOpen } from "lucide-react"

export default function DropdownMenuRadioGroupDemo() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
        <label></label>
        <Button variant="outline">Interview Status <PanelTopOpen /></Button>

        </div>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="scheduled">Scheduled</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="rescheduled">Rescheduled</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
