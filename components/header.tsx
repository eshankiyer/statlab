"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { withBasePath } from "@/lib/base-path"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={withBasePath("/logo.png")}
            alt="StatLab Interactive"
            width={32}
            height={34}
            className="h-8 w-auto"
            priority
          />
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

