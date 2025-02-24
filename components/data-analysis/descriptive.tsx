"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import * as jStat from "jstat"

export function DescriptiveStatistics() {
  const [data, setData] = useState<string>("")
  const [results, setResults] = useState<{
    mean: number
    median: number
    mode: number[]
    sd: number
    variance: number
    min: number
    max: number
    q1: number
    q3: number
    histogram: { bin: string; frequency: number }[]
  } | null>(null)

  const parseData = (input: string): number[] => {
    return input
      .trim()
      .split(/[\n,\t ]/)
      .map(Number)
      .filter((x) => !isNaN(x))
  }

  const calculateMode = (numbers: number[]): number[] => {
    const frequencies: Record<number, number> = {}
    numbers.forEach((num) => {
      frequencies[num] = (frequencies[num] || 0) + 1
    })

    const maxFrequency = Math.max(...Object.values(frequencies))
    return Object.entries(frequencies)
      .filter(([_, freq]) => freq === maxFrequency)
      .map(([num, _]) => Number(num))
  }

  const createHistogram = (numbers: number[]): { bin: string; frequency: number }[] => {
    const min = Math.min(...numbers)
    const max = Math.max(...numbers)
    const binWidth = (max - min) / 10
    const bins: { bin: string; frequency: number }[] = []

    for (let i = 0; i < 10; i++) {
      const start = min + i * binWidth
      const end = start + binWidth
      const count = numbers.filter((n) => n >= start && n < end).length
      bins.push({
        bin: `${start.toFixed(1)}-${end.toFixed(1)}`,
        frequency: count,
      })
    }

    return bins
  }

  const calculateStatistics = () => {
    const numbers = parseData(data)
    if (numbers.length === 0) {
      alert("Please enter valid numeric data")
      return
    }

    const sorted = [...numbers].sort((a, b) => a - b)
    const q1Index = Math.floor(sorted.length / 4)
    const q3Index = Math.floor((3 * sorted.length) / 4)

    setResults({
      mean: jStat.mean(numbers),
      median: jStat.median(numbers),
      mode: calculateMode(numbers),
      sd: jStat.stdev(numbers),
      variance: jStat.variance(numbers),
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      q1: sorted[q1Index],
      q3: sorted[q3Index],
      histogram: createHistogram(numbers),
    })
  }

  return (
    <Card className="bg-[#1B3B6F]">
      <CardHeader>
        <CardTitle>Descriptive Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="data">Data</label>
          <Textarea
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter numbers separated by spaces, commas, or new lines"
            rows={10}
            className="font-mono bg-[#21295C]"
          />
        </div>

        <Button onClick={calculateStatistics} className="bg-[#065A82] hover:bg-[#1C7293]">
          Calculate Statistics
        </Button>

        {results && (
          <>
            <div className="mt-4 p-4 bg-[#21295C] rounded-lg space-y-2">
              <p className="font-mono">Mean = {results.mean.toFixed(4)}</p>
              <p className="font-mono">Median = {results.median.toFixed(4)}</p>
              <p className="font-mono">Mode = {results.mode.join(", ")}</p>
              <p className="font-mono">Standard Deviation = {results.sd.toFixed(4)}</p>
              <p className="font-mono">Variance = {results.variance.toFixed(4)}</p>
              <p className="font-mono">Minimum = {results.min.toFixed(4)}</p>
              <p className="font-mono">Maximum = {results.max.toFixed(4)}</p>
              <p className="font-mono">Q1 = {results.q1.toFixed(4)}</p>
              <p className="font-mono">Q3 = {results.q3.toFixed(4)}</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.histogram}>
                <XAxis dataKey="bin" stroke="#9EB3C2" />
                <YAxis stroke="#9EB3C2" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#21295C",
                    border: "none",
                  }}
                />
                <Bar dataKey="frequency" fill="#1C7293" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

