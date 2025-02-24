"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useCollaborativeData } from "@/hooks/use-collaborative-data"

interface QuantitativeData {
  value: number
}

export function QuantitativeSingle() {
  const [localData, setLocalData] = useState<QuantitativeData[]>([{ value: 0 }])
  const { data: collaborativeData, updateData } = useCollaborativeData<QuantitativeData[]>("quantitative-single", [
    { value: 0 },
  ])
  const [results, setResults] = useState<{
    mean: number
    median: number
    standardDeviation: number
    minimum: number
    maximum: number
  } | null>(null)

  useEffect(() => {
    setLocalData(collaborativeData)
  }, [collaborativeData])

  const addDataPoint = () => {
    const newData = [...localData, { value: 0 }]
    setLocalData(newData)
    updateData(newData)
  }

  const updateDataPoint = (index: number, value: number) => {
    const newData = [...localData]
    newData[index].value = value
    setLocalData(newData)
    updateData(newData)
  }

  const removeDataPoint = (index: number) => {
    if (localData.length > 1) {
      const newData = localData.filter((_, i) => i !== index)
      setLocalData(newData)
      updateData(newData)
    }
  }

  const calculateStatistics = () => {
    const values = localData.map((d) => d.value)
    const n = values.length
    const mean = values.reduce((a, b) => a + b, 0) / n
    const sortedValues = [...values].sort((a, b) => a - b)
    const median = n % 2 === 0 ? (sortedValues[n / 2 - 1] + sortedValues[n / 2]) / 2 : sortedValues[Math.floor(n / 2)]
    const variance = values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n
    const standardDeviation = Math.sqrt(variance)
    const minimum = Math.min(...values)
    const maximum = Math.max(...values)

    setResults({ mean, median, standardDeviation, minimum, maximum })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantitative Variable Analysis (Single Group)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.map((dataPoint, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="number"
                    value={dataPoint.value}
                    onChange={(e) => updateDataPoint(index, Number(e.target.value))}
                    step="any"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDataPoint(index)}
                    disabled={localData.length <= 1}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2">
          <Button onClick={addDataPoint}>Add Data Point</Button>
          <Button onClick={calculateStatistics}>Analyze Data</Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Mean: {results.mean.toFixed(4)}</p>
                <p>Median: {results.median.toFixed(4)}</p>
                <p>Standard Deviation: {results.standardDeviation.toFixed(4)}</p>
                <p>Minimum: {results.minimum.toFixed(4)}</p>
                <p>Maximum: {results.maximum.toFixed(4)}</p>
              </CardContent>
            </Card>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={localData.map((d, i) => ({ x: i + 1, y: d.value }))}>
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="y" stroke="var(--primary)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

