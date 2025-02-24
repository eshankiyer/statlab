"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { jstat } from "jstat"

export function BinomialCalculator() {
  const [n, setN] = useState("10")
  const [p, setP] = useState("0.5")
  const [operation, setOperation] = useState("exact")
  const [value, setValue] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const calculateProbability = (x: number) => {
    return jstat.binomial.pdf(x, Number(n), Number(p))
  }

  const calculateCumulativeProbability = (x: number) => {
    return jstat.binomial.cdf(x, Number(n), Number(p))
  }

  const handleCalculation = () => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0 || numValue > Number(n) || !Number.isInteger(numValue)) {
      setResult("Please enter a valid integer between 0 and n")
      return
    }

    if (operation === "exact") {
      setResult(`P(X = ${value}) = ${calculateProbability(numValue).toFixed(4)}`)
    } else if (operation === "atMost") {
      setResult(`P(X ≤ ${value}) = ${calculateCumulativeProbability(numValue).toFixed(4)}`)
    } else {
      setResult(`P(X > ${value}) = ${(1 - calculateCumulativeProbability(numValue)).toFixed(4)}`)
    }
  }

  const generateChartData = () => {
    const data = []
    const numN = Number(n)
    for (let i = 0; i <= numN; i++) {
      data.push({
        x: i,
        probability: calculateProbability(i),
      })
    }
    return data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Binomial Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="n">Number of trials (n)</label>
            <Input id="n" type="number" value={n} onChange={(e) => setN(e.target.value)} min="1" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="p">Probability of success (p)</label>
            <Input id="p" type="number" value={p} onChange={(e) => setP(e.target.value)} min="0" max="1" step="0.01" />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="operation">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger id="operation">
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exact">P(X = k)</SelectItem>
              <SelectItem value="atMost">P(X ≤ k)</SelectItem>
              <SelectItem value="moreThan">P(X > k)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="value">k value</label>
          <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} min="0" />
        </div>

        <Button onClick={handleCalculation}>Calculate</Button>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-mono">{result}</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={generateChartData()}>
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="probability" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

