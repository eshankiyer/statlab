"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DataPoint {
  [key: string]: number
}

export function MultipleRegression() {
  const [variables, setVariables] = useState<string[]>(["x1", "x2", "y"])
  const [data, setData] = useState<DataPoint[]>([
    { x1: 0, x2: 0, y: 0 },
    { x1: 0, x2: 0, y: 0 },
  ])
  const [results, setResults] = useState<{
    coefficients: { [key: string]: number }
    rSquared: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addVariable = () => {
    const newVar = `x${variables.length}`
    setVariables([...variables.slice(0, -1), newVar, "y"])
    setData(data.map((point) => ({ ...point, [newVar]: 0 })))
  }

  const addDataPoint = () => {
    setData([...data, Object.fromEntries(variables.map((v) => [v, 0]))])
  }

  const updateDataPoint = (index: number, variable: string, value: number) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [variable]: value }
    setData(newData)
    setError(null) // Clear error when data is updated
  }

  const removeDataPoint = (index: number) => {
    if (data.length > 2) {
      // Prevent removing if only 2 points remain
      setData(data.filter((_, i) => i !== index))
    } else {
      setError("Cannot remove data point. Minimum 2 points required.")
    }
  }

  const calculateRegression = () => {
    if (data.length < 2) {
      setError("Please enter at least 2 data points")
      return
    }

    try {
      const X = data.map((point) => [1, ...variables.slice(0, -1).map((v) => point[v])])
      const y = data.map((point) => point.y)

      // Calculate coefficients using normal equation: β = (X^T X)^(-1) X^T y
      const XT = transpose(X)
      const XTX = multiply(XT, X)
      const XTXInv = inverse(XTX)
      const XTy = multiply(XT, [y])
      const coefficients = multiply(XTXInv, XTy).map((c) => c[0])

      // Calculate R-squared
      const yHat = multiply(X, [coefficients]).map((y) => y[0])
      const yMean = y.reduce((a, b) => a + b, 0) / y.length
      const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
      const ssResidual = y.reduce((sum, yi, i) => sum + Math.pow(yi - yHat[i], 2), 0)
      const rSquared = 1 - ssResidual / ssTotal

      setResults({
        coefficients: Object.fromEntries([
          ["intercept", coefficients[0]],
          ...variables.slice(0, -1).map((v, i) => [v, coefficients[i + 1]]),
        ]),
        rSquared,
      })
      setError(null)
    } catch (err) {
      setError("Error calculating regression. Please check your data.")
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-foreground">Multiple Regression Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {variables.map((v) => (
                <TableHead key={v} className="text-foreground">
                  {v}
                </TableHead>
              ))}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((point, index) => (
              <TableRow key={index}>
                {variables.map((v) => (
                  <TableCell key={v}>
                    <Input
                      type="number"
                      value={point[v]}
                      onChange={(e) => updateDataPoint(index, v, Number(e.target.value))}
                      step="any"
                      className="bg-white dark:bg-white text-black"
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDataPoint(index)}
                    disabled={data.length <= 2}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2">
          <Button onClick={addVariable}>Add Variable</Button>
          <Button onClick={addDataPoint}>Add Data Point</Button>
          <Button onClick={calculateRegression}>Analyze Data</Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white dark:bg-white text-black rounded-lg">
                  <p>R-squared: {results.rSquared.toFixed(4)}</p>
                  <p>
                    Equation: y ={" "}
                    {Object.entries(results.coefficients)
                      .map(([variable, coeff], index) =>
                        index === 0
                          ? coeff.toFixed(4)
                          : `${coeff >= 0 ? " + " : " - "}${Math.abs(coeff).toFixed(4)}${variable === "intercept" ? "" : variable}`,
                      )
                      .join("")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {variables.length === 3 && (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <XAxis dataKey={variables[0]} type="number" name={variables[0]} stroke="currentColor" />
                  <YAxis dataKey="y" type="number" name="y" stroke="currentColor" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid #ccc",
                    }}
                  />
                  <Scatter name="Data Points" data={data} fill="currentColor" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]))
}

function multiply(a: number[][], b: number[][]): number[][] {
  return a.map((row) => transpose(b).map((col) => row.reduce((sum, elm, i) => sum + elm * col[i], 0)))
}

function inverse(matrix: number[][]): number[][] {
  const n = matrix.length
  const identity = Array(n)
    .fill(0)
    .map((_, i) =>
      Array(n)
        .fill(0)
        .map((_, j) => (i === j ? 1 : 0)),
    )
  const augmented = matrix.map((row, i) => [...row, ...identity[i]])

  for (let i = 0; i < n; i++) {
    let maxRow = i
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = j
      }
    }
    ;[augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

    const pivot = augmented[i][i]
    if (Math.abs(pivot) < 1e-10) {
      throw new Error("Matrix is singular or nearly singular")
    }

    for (let j = i; j < 2 * n; j++) {
      augmented[i][j] /= pivot
    }

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = augmented[j][i]
        for (let k = i; k < 2 * n; k++) {
          augmented[j][k] -= factor * augmented[i][k]
        }
      }
    }
  }

  return augmented.map((row) => row.slice(n))
}

