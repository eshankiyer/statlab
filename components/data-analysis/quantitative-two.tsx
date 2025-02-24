"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useCollaborativeData } from "@/hooks/use-collaborative-data"

interface DataPoint {
  x: number
  y: number
}

export function QuantitativeTwo() {
  const [localData, setLocalData] = useState<DataPoint[]>([{ x: 0, y: 0 }])
  const { data: collaborativeData, updateData } = useCollaborativeData<DataPoint[]>("quantitative-two", [
    { x: 0, y: 0 },
  ])
  const [results, setResults] = useState<{
    correlation: number
    rSquared: number
    slope: number
    intercept: number
  } | null>(null)

  useEffect(() => {
    setLocalData(collaborativeData)
  }, [collaborativeData])

  const addDataPoint = () => {
    const newData = [...localData, { x: 0, y: 0 }]
    setLocalData(newData)
    updateData(newData)
  }

  const updateDataPoint = (index: number, field: "x" | "y", value: number) => {
    const newData = [...localData]
    newData[index][field] = value
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
    const n = localData.length
    const sumX = localData.reduce((sum, point) => sum + point.x, 0)
    const sumY = localData.reduce((sum, point) => sum + point.y, 0)
    const sumXY = localData.reduce((sum, point) => sum + point.x * point.y, 0)
    const sumXX = localData.reduce((sum, point) => sum + point.x * point.x, 0)
    const sumYY = localData.reduce((sum, point) => sum + point.y * point.y, 0)

    const meanX = sumX / n
    const meanY = sumY / n

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = meanY - slope * meanX

    const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))
    const rSquared = correlation * correlation

    setResults({ correlation, rSquared, slope, intercept })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two Quantitative Variables Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>X</TableHead>
              <TableHead>Y</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.map((point, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    type="number"
                    value={point.x}
                    onChange={(e) => updateDataPoint(index, "x", Number(e.target.value))}
                    step="any"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={point.y}
                    onChange={(e) => updateDataPoint(index, "y", Number(e.target.value))}
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
                <p>Correlation: {results.correlation.toFixed(4)}</p>
                <p>R-squared: {results.rSquared.toFixed(4)}</p>
                <p>Slope: {results.slope.toFixed(4)}</p>
                <p>Intercept: {results.intercept.toFixed(4)}</p>
                <p>
                  Equation: y = {results.slope.toFixed(4)}x + {results.intercept.toFixed(4)}
                </p>
              </CardContent>
            </Card>

            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <XAxis dataKey="x" type="number" name="X" />
                <YAxis dataKey="y" type="number" name="Y" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Data Points" data={localData} fill="var(--primary)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

