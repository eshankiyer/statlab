"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function NormalDistribution() {
  const [mean, setMean] = useState(0)
  const [stdDev, setStdDev] = useState(1)
  const [xValue, setXValue] = useState(0)
  const [operation, setOperation] = useState<"lessThan" | "greaterThan" | "between">("lessThan")
  const [xValue2, setXValue2] = useState(0)
  const [result, setResult] = useState<number | null>(null)

  // Error function approximation
  const erf = useCallback((x: number): number => {
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }, [])

  // Normal PDF calculation
  const normalPDF = useCallback(
    (x: number): number => {
      const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI))
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2))
      return coefficient * Math.exp(exponent)
    },
    [mean, stdDev],
  )

  // Normal CDF calculation
  const normalCDF = useCallback(
    (x: number): number => {
      return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2) * stdDev)))
    },
    [mean, stdDev, erf],
  )

  const calculateProbability = () => {
    let probability: number

    if (operation === "lessThan") {
      probability = normalCDF(xValue)
    } else if (operation === "greaterThan") {
      probability = 1 - normalCDF(xValue)
    } else {
      probability = normalCDF(xValue2) - normalCDF(xValue)
    }

    setResult(probability)
  }

  const generateChartData = useCallback(() => {
    const data = []
    const range = stdDev * 4
    const step = range / 50

    for (let x = mean - range; x <= mean + range; x += step) {
      data.push({
        x,
        y: normalPDF(x),
      })
    }

    return data
  }, [mean, stdDev, normalPDF])

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Normal Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="mean" className="text-foreground">
              Mean (μ)
            </label>
            <Input
              id="mean"
              type="number"
              value={mean}
              onChange={(e) => setMean(Number(e.target.value))}
              step="any"
              className="bg-background text-foreground border-input"
            />
          </div>
          <div>
            <label htmlFor="stdDev" className="text-foreground">
              Standard Deviation (σ)
            </label>
            <Input
              id="stdDev"
              type="number"
              value={stdDev}
              onChange={(e) => setStdDev(Number(e.target.value))}
              step="any"
              min="0"
              className="bg-background text-foreground border-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="operation" className="text-foreground">
            Operation
          </label>
          <Select
            value={operation}
            onValueChange={(value: "lessThan" | "greaterThan" | "between") => setOperation(value)}
          >
            <SelectTrigger id="operation" className="bg-background text-foreground">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lessThan">P(X &lt; x)</SelectItem>
              <SelectItem value="greaterThan">P(X &gt; x)</SelectItem>
              <SelectItem value="between">P(x₁ &lt; X &lt; x₂)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="xValue" className="text-foreground">
              X Value
            </label>
            <Input
              id="xValue"
              type="number"
              value={xValue}
              onChange={(e) => setXValue(Number(e.target.value))}
              step="any"
              className="bg-background text-foreground border-input"
            />
          </div>
          {operation === "between" && (
            <div>
              <label htmlFor="xValue2" className="text-foreground">
                Second X Value
              </label>
              <Input
                id="xValue2"
                type="number"
                value={xValue2}
                onChange={(e) => setXValue2(Number(e.target.value))}
                step="any"
                className="bg-background text-foreground border-input"
              />
            </div>
          )}
        </div>

        <Button onClick={calculateProbability} className="w-full">
          Calculate Probability
        </Button>

        {result !== null && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-mono text-foreground">Probability: {result.toFixed(6)}</p>
          </div>
        )}

        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <LineChart data={generateChartData()}>
              <XAxis
                dataKey="x"
                domain={[mean - 4 * stdDev, mean + 4 * stdDev]}
                type="number"
                tickFormatter={(value) => value.toFixed(2)}
                stroke="currentColor"
              />
              <YAxis stroke="currentColor" />
              <Tooltip
                formatter={(value: number) => value.toFixed(4)}
                labelFormatter={(label: number) => `x = ${label.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              />
              <Line type="monotone" dataKey="y" stroke="currentColor" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

