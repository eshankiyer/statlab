"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Settings() {
  return (
    <div className="container py-6 border-t">
      <h2 className="font-semibold text-lg mb-4">Settings</h2>
      <div className="grid gap-4 max-w-[400px]">
        <div className="grid gap-2">
          <label htmlFor="color-theme">Color Theme</label>
          <Select defaultValue="light">
            <SelectTrigger id="color-theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="rounding">Rounding Precision</label>
          <Select defaultValue="2">
            <SelectTrigger id="rounding">
              <SelectValue placeholder="Select precision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 decimals</SelectItem>
              <SelectItem value="1">1 decimal</SelectItem>
              <SelectItem value="2">2 decimals</SelectItem>
              <SelectItem value="3">3 decimals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="display">Display Format</label>
          <Select defaultValue="percentage">
            <SelectTrigger id="display">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="proportion">Proportion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

