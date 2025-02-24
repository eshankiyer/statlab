"use client"

import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="StatLab Interactive" className="h-8 w-auto" />
          <span className="font-semibold text-lg">StatLab Interactive</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" showSettings>
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

