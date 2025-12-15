"use client"

import * as React from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function DropdownInput({ options, placeholder = "Select an option", className, onValueChange, value, selectedLabel, selectedValue }) {
  const isObjectArray = options && options.length > 0 && typeof options[0] === 'object'

  const getInitialSelected = () => {
    if (selectedValue !== undefined) {
      if (isObjectArray && typeof selectedValue === 'object') {
        return selectedValue.id
      }
      return selectedValue
    }
    if (value !== undefined) {
      return value
    }
    if (options && options.length > 0) {
      return isObjectArray ? options[0].id : options[0]
    }
    return ""
  }

  const [internalSelected, setInternalSelected] = React.useState(getInitialSelected())

  const selected = selectedValue !== undefined ? (isObjectArray && typeof selectedValue === 'object' ? selectedValue.id : selectedValue) : (value !== undefined ? value : internalSelected)

  const currentSelectedLabel = selectedLabel || (isObjectArray && selected ? options.find(option => option.id === selected)?.label : selected)

  const handleValueChange = (newValue) => {
    let selectedValue = newValue
    if (isObjectArray) {
      const selectedOption = options.find(option => option.id === newValue)
      selectedValue = selectedOption || newValue
    }
    if (onValueChange) {
      onValueChange(selectedValue)
    } else {
      setInternalSelected(newValue)
    }
  }

  return (
    <Select value={selected} onValueChange={handleValueChange}>
      <SelectTrigger className={cn("w-48", className)}>
        <SelectValue placeholder={placeholder}>
          {currentSelectedLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options && options.map((option) => {
          if (isObjectArray) {
            return (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            )
          }
          return (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
