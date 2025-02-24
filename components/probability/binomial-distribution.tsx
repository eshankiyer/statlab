"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

export function BinomialDistribution() {
  const [n, setN] = useState(10)
  const [p, setP] = useState(0.5)
  const [k, setK] = useState(5)
  const [operation, setOperation] = useState<"exact" | "atMost" | "atLeast">("exact")
  const [result, setResult] = useState<number | null>(null)

  // Function to calculate binomial coefficient (n choose k)
  const binomialCoefficient = (n: number, k: number): number => {
    if (k < 0 || k > n) {
      return 0
    }
    if (k === 0 || k === n) {
      return 1
    }
    if (k > n / 2) {
      k = n - k
    }
    let res = 1
    for (let i = 1; i <= k; ++i) {
      res = (res * (n - i + 1)) / i
    }
    return res
  }

  // Function to calculate binomial probability
  const binomialProbability = (n: number, p: number, k: number): number => {
    return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k)
  }

  // Function to calculate the result based on the operation
  const calculateResult = () => {
    if (operation === "exact") {
      setResult(binomialProbability(n, p, k))
    } else if (operation === "atMost") {
      let sum = 0
      for (let i = 0; i <= k; i++) {
        sum += binomialProbability(n, p, i)
      }
      setResult(sum)
    } else if (operation === "atLeast") {
      let sum = 0
      for (let i = k; i <= n; i++) {
        sum += binomialProbability(n, p, i)
      }
      setResult(sum)
    }
  }

  // Function to generate chart data
  const generateChartData = () => {
    const data = []
    for (let i = 0; i <= n; i++) {
      data.push({ k: i, probability: binomialProbability(n, p, i) })
    }
    return data
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Binomial Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Number of trials (n)</label>
            <Input type="number" value={n} onChange={(e) => setN(Number.parseInt(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Probability of success (p)</label>
            <Input type="number" step="0.01" value={p} onChange={(e) => setP(Number.parseFloat(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Number of successes (k)</label>
            <Input type="number" value={k} onChange={(e) => setK(Number.parseInt(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Operation</label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact (P(X = k))</SelectItem>
                <SelectItem value="atMost">At Most (P(X ≤ k))</SelectItem>
                <SelectItem value="atLeast">At Least (P(X ≥ k))</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculateResult}>Calculate</Button>
        {result !== null && (
          <div className="mt-4">
            <p className="text-foreground">Result: {result.toFixed(4)}</p>
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

