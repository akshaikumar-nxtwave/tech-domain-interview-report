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

interface DropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function PlacedDropDown({ value, onChange }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {value || "Select"} <PanelTopOpen />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="On-Campus">On-Campus</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="External">External</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Nxtwave">Nxtwave</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
