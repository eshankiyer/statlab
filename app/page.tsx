import { MainNavigation } from "@/components/main-navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">StatLab Interactive</h1>
        <MainNavigation />
      </div>
    </div>
  )
}

