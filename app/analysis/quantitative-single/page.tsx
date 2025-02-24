import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { QuantitativeSingle } from "@/components/data-analysis/quantitative-single"

export default function QuantitativeSinglePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <QuantitativeSingle />
    </div>
  )
}

