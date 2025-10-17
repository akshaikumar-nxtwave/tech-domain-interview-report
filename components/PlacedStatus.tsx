"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

interface DropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function DropdownMenuRadioGroupDemo({ value, onChange }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={`bg-${value}-500 w-2 h-2 rounded-full border`}>
          
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="nw">Internal</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="external">External</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
