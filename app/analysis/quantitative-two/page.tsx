import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { QuantitativeTwo } from "@/components/data-analysis/quantitative-two"

export default function QuantitativeTwoPage() {
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
      <QuantitativeTwo />
    </div>
  )
}

