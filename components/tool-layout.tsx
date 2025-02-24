import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import type React from "react"

interface ToolLayoutProps {
  title: string
  children: React.ReactNode
  backTo?: string
}

export function ToolLayout({ title, children, backTo = "/" }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={backTo} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        {children}
      </div>
    </div>
  )
}

