"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function ChiSquareDistribution() {
  const [df, setDf] = useState(5)
  const [x, setX] = useState(7.5)
  const [operation, setOperation] = useState<"lessThan" | "greaterThan">("lessThan")
  const [result, setResult] = useState<number | null>(null)

  // Chi-square PDF calculation
  const chiSquarePDF = (x: number, df: number): number => {
    if (x < 0) return 0
    const coefficient = 1 / (Math.pow(2, df / 2) * gamma(df / 2))
    return coefficient * Math.pow(x, df / 2 - 1) * Math.exp(-x / 2)
  }

  // Chi-square CDF calculation using numerical integration (Simpson's rule)
  const chiSquareCDF = (x: number, df: number): number => {
    if (x <= 0) return 0
    const n = 1000 // number of intervals
    const h = x / n // width of each interval

    let sum = chiSquarePDF(0, df) + chiSquarePDF(x, df)

    for (let i = 1; i < n; i++) {
      const xi = i * h
      sum += 2 * chiSquarePDF(xi, df)
      if (i % 2 === 1) {
        sum += 2 * chiSquarePDF(xi, df)
      }
    }

    return (h / 3) * sum
  }

  // Gamma function approximation (Lanczos approximation)
  const gamma = (z: number): number => {
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
    }

    z -= 1
    const p = [
      676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
    ]

    let x = 0.99999999999980993
    for (let i = 0; i < p.length; i++) {
      x += p[i] / (z + i + 1)
    }

    const t = z + p.length - 0.5
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
  }

  const calculateProbability = () => {
    let probability: number

    if (operation === "lessThan") {
      probability = chiSquareCDF(x, df)
    } else {
      probability = 1 - chiSquareCDF(x, df)
    }

    setResult(probability)
  }

  const generateChartData = () => {
    const data = []
    const step = 0.1
    const maxX = Math.max(20, x * 2)

    for (let i = 0; i <= maxX; i += step) {
      data.push({
        x: i,
        y: chiSquarePDF(i, df),
      })
    }

    return data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi-Square Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="df">Degrees of Freedom</label>
            <Input id="df" type="number" value={df} onChange={(e) => setDf(Number(e.target.value))} min="1" />
          </div>
          <div>
            <label htmlFor="x">Chi-Square Value</label>
            <Input id="x" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} step="0.1" min="0" />
          </div>
        </div>

        <div>
          <label htmlFor="operation">Operation</label>
          <Select value={operation} onValueChange={(value: "lessThan" | "greaterThan") => setOperation(value)}>
            <SelectTrigger id="operation">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lessThan">P(X² ≤ x)</SelectItem>
              <SelectItem value="greaterThan">P(X² > x)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateProbability}>Calculate Probability</Button>

        {result !== null && (
          <div>
            <p>Probability: {result.toFixed(6)}</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={generateChartData()}>
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="var(--primary)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

