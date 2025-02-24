"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

export function PoissonDistribution() {
  const [lambda, setLambda] = useState(5)
  const [k, setK] = useState(3)
  const [operation, setOperation] = useState<"exact" | "atMost" | "atLeast">("exact")
  const [result, setResult] = useState<number | null>(null)

  const calculatePoisson = (lambda: number, k: number): number => {
    return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k)
  }

  const factorial = (n: number): number => {
    if (n === 0) {
      return 1
    }
    let result = 1
    for (let i = 1; i <= n; i++) {
      result *= i
    }
    return result
  }

  const calculateResult = () => {
    if (!lambda || !k) {
      setResult(null)
      return
    }

    if (operation === "exact") {
      setResult(calculatePoisson(lambda, k))
    } else if (operation === "atMost") {
      let sum = 0
      for (let i = 0; i <= k; i++) {
        sum += calculatePoisson(lambda, i)
      }
      setResult(sum)
    } else if (operation === "atLeast") {
      let sum = 0
      for (let i = k; i <= 20; i++) {
        sum += calculatePoisson(lambda, i)
      }
      setResult(sum)
    }
  }

  const generateChartData = () => {
    const data = []
    for (let i = 0; i <= 20; i++) {
      const probability = calculatePoisson(lambda, i)
      data.push({ k: i, probability })
    }
    return data
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Poisson Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="lambda">
              Lambda (λ)
            </label>
            <Input
              type="number"
              id="lambda"
              placeholder="Expected rate of occurrence"
              value={lambda}
              onChange={(e) => setLambda(Number.parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed" htmlFor="k">
              k
            </label>
            <Input
              type="number"
              id="k"
              placeholder="Number of events"
              value={k}
              onChange={(e) => setK(Number.parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">Operation</label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact</SelectItem>
                <SelectItem value="atMost">At Most</SelectItem>
                <SelectItem value="atLeast">At Least</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculateResult}>Calculate</Button>
        {result !== null && (
          <div className="mt-4">
            Result: <span className="font-bold">{result.toFixed(5)}</span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={generateChartData()}>
            <XAxis dataKey="k" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <Bar dataKey="probability" fill="currentColor" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

