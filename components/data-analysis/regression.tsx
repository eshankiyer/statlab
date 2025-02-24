"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Upload, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RegressionResults {
  coefficients: number[]
  rSquared: number
  adjustedRSquared: number
  standardErrors: number[]
  tValues: number[]
  pValues: number[]
}

export function Regression() {
  const [variableNames, setVariableNames] = useState(["x1", "y"])
  const [data, setData] = useState<number[][]>([[0, 0]])
  const [results, setResults] = useState<RegressionResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addVariable = () => {
    const newVarName = `x${variableNames.length}`
    setVariableNames([...variableNames.slice(0, -1), newVarName, "y"])
    setData(data.map((row) => [...row.slice(0, -1), 0, row[row.length - 1]]))
  }

  const removeVariable = () => {
    if (variableNames.length > 2) {
      setVariableNames(variableNames.slice(0, -2).concat("y"))
      setData(data.map((row) => [...row.slice(0, -2), row[row.length - 1]]))
    }
  }

  const addRow = () => {
    setData([...data, Array(variableNames.length).fill(0)])
  }

  const removeRow = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index))
    }
  }

  const updateData = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data]
    newData[rowIndex][colIndex] = Number(value) || 0
    setData(newData)
  }

  const calculateRegression = () => {
    try {
      setError(null)

      // Extract X (independent variables) and y (dependent variable)
      const y = data.map((row) => row[row.length - 1])
      const X = data.map((row) => [1, ...row.slice(0, -1)]) // Add column of 1s for intercept

      const n = data.length // number of observations
      const p = X[0].length // number of parameters (including intercept)

      if (n < p) {
        throw new Error("Not enough data points for the number of variables")
      }

      // Calculate means
      const yMean = y.reduce((sum, val) => sum + val, 0) / n
      const xMeans = Array(p).fill(0)
      for (let j = 1; j < p; j++) {
        // Skip intercept column
        xMeans[j] = X.reduce((sum, row) => sum + row[j], 0) / n
      }

      // Center the variables
      const centeredY = y.map((yi) => yi - yMean)
      const centeredX = X.map((row) => row.map((xij, j) => (j === 0 ? xij : xij - xMeans[j])))

      // Calculate sums of squares and cross-products
      const SSxx: number[][] = Array(p)
        .fill(0)
        .map(() => Array(p).fill(0))
      const SSxy: number[] = Array(p).fill(0)

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < p; j++) {
          SSxy[j] += centeredX[i][j] * centeredY[i]
          for (let k = 0; k < p; k++) {
            SSxx[j][k] += centeredX[i][j] * centeredX[i][k]
          }
        }
      }

      // Solve for coefficients using Gaussian elimination
      const coefficients = gaussianElimination(SSxx, SSxy)

      // Calculate fitted values and residuals
      const yHat = X.map((row) => row.reduce((sum, xij, j) => sum + xij * coefficients[j], 0))
      const residuals = y.map((yi, i) => yi - yHat[i])

      // Calculate R-squared
      const SST = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
      const SSR = residuals.reduce((sum, ri) => sum + ri * ri, 0)
      const rSquared = Math.max(0, Math.min(1, 1 - SSR / SST))

      // Calculate adjusted R-squared
      const adjustedRSquared = Math.max(0, Math.min(1, 1 - SSR / (n - p) / (SST / (n - 1))))

      // Calculate standard errors
      const MSE = SSR / (n - p)
      const standardErrors = Array(p).fill(0)
      for (let i = 0; i < p; i++) {
        standardErrors[i] = Math.sqrt(MSE * Math.abs(SSxx[i][i]))
      }

      // Calculate t-values and p-values
      const tValues = coefficients.map((coef, i) => coef / standardErrors[i])
      const pValues = tValues.map((t) => 2 * (1 - studentT(Math.abs(t), n - p)))

      setResults({
        coefficients,
        rSquared,
        adjustedRSquared,
        standardErrors,
        tValues,
        pValues,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error calculating regression")
      setResults(null)
    }
  }

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," + variableNames.join(",") + "\n" + data.map((row) => row.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "regression_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim())
        const newData = lines.slice(1).map((line) => line.split(",").map((val) => Number(val.trim()) || 0))
        setVariableNames(headers)
        setData(newData)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Multiple Regression Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={addVariable} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add Variable
            </Button>
            <Button onClick={removeVariable} variant="secondary" disabled={variableNames.length <= 2}>
              <Minus className="mr-2 h-4 w-4" /> Remove Variable
            </Button>
            <Button onClick={addRow} variant="default">
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {variableNames.map((name, index) => (
                    <TableHead key={index} className="font-bold">
                      {name}
                    </TableHead>
                  ))}
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((value, colIndex) => (
                      <TableCell key={colIndex}>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => updateData(rowIndex, colIndex, e.target.value)}
                          className="bg-background"
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRow(rowIndex)}
                        disabled={data.length <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={calculateRegression} className="w-full">
            Calculate Regression
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Regression Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-semibold mb-2">Model Fit</h3>
                    <p>R² = {results.rSquared.toFixed(4)}</p>
                    <p>Adjusted R² = {results.adjustedRSquared.toFixed(4)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h3 className="font-semibold mb-2">Regression Equation</h3>
                    <p className="font-mono text-sm">
                      y ={" "}
                      {results.coefficients
                        .map(
                          (coef, i) =>
                            `${
                              i === 0
                                ? coef.toFixed(4)
                                : `${coef >= 0 ? " + " : " - "}${Math.abs(coef).toFixed(4)}${variableNames[i]}`
                            }`,
                        )
                        .join("")}
                    </p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variable</TableHead>
                        <TableHead>Coefficient</TableHead>
                        <TableHead>Std. Error</TableHead>
                        <TableHead>t-value</TableHead>
                        <TableHead>p-value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {["Intercept", ...variableNames.slice(0, -1)].map((name, i) => (
                        <TableRow key={name}>
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell>{results.coefficients[i].toFixed(4)}</TableCell>
                          <TableCell>{results.standardErrors[i].toFixed(4)}</TableCell>
                          <TableCell>{results.tValues[i].toFixed(4)}</TableCell>
                          <TableCell>{results.pValues[i].toFixed(4)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Gaussian elimination with partial pivoting
function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length
  const augmented = A.map((row, i) => [...row, b[i]])

  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = j
      }
    }
    // Swap maximum row with current row
    ;[augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

    // Make all rows below this one 0 in current column
    for (let j = i + 1; j < n; j++) {
      const factor = augmented[j][i] / augmented[i][i]
      for (let k = i; k <= n; k++) {
        augmented[j][k] -= factor * augmented[i][k]
      }
    }
  }

  // Back substitution
  const x = Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let sum = augmented[i][n]
    for (let j = i + 1; j < n; j++) {
      sum -= augmented[i][j] * x[j]
    }
    x[i] = sum / augmented[i][i]
  }

  return x
}

// Student's t-distribution CDF approximation
function studentT(t: number, df: number): number {
  const x = df / (df + t * t)
  const beta = incompleteBeta(df / 2, 0.5, x)
  return 1 - 0.5 * beta
}

// Incomplete beta function approximation
function incompleteBeta(a: number, b: number, x: number): number {
  if (x === 0) return 0
  if (x === 1) return 1

  const maxIterations = 100
  const epsilon = 1e-8
  let sum = 0
  let term = 1

  for (let i = 0; i < maxIterations; i++) {
    term *= ((a + i) * x) / (a + b + i)
    sum += term
    if (Math.abs(term) < epsilon) break
  }

  return (sum * Math.pow(x, a) * Math.pow(1 - x, b)) / a
}

export default Regression

