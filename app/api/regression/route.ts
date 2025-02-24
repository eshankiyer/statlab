import { NextResponse } from "next/server"

interface RegressionInput {
  data: number[][]
  variableNames: string[]
}

interface RegressionResults {
  coefficients: number[]
  rSquared: number
  adjustedRSquared: number
  standardErrors: number[]
  tValues: number[]
  pValues: number[]
}

export async function POST(request: Request) {
  const body: RegressionInput = await request.json()
  const { data, variableNames } = body

  try {
    const results = calculateRegression(data, variableNames)
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Error calculating regression" }, { status: 400 })
  }
}

function calculateRegression(data: number[][], variableNames: string[]): RegressionResults {
  const X = data.map((row) => [1, ...row.slice(0, -1)])
  const y = data.map((row) => row[row.length - 1])
  const n = X.length
  const p = X[0].length

  const XT = transpose(X)
  const XTX = multiply(XT, X)
  const XTXInv = inverse(XTX)
  const XTy = multiply(XT, [y])
  const coefficients = multiply(XTXInv, XTy).map((row) => row[0])

  const yHat = multiply(X, [coefficients]).map((row) => row[0])
  const residuals = y.map((yi, i) => yi - yHat[i])
  const yMean = y.reduce((sum, yi) => sum + yi, 0) / n

  const SST = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
  const SSR = residuals.reduce((sum, ri) => sum + Math.pow(ri, 2), 0)
  const rSquared = 1 - SSR / SST
  const adjustedRSquared = 1 - SSR / (n - p) / (SST / (n - 1))

  const MSE = SSR / (n - p)
  const varCovar = multiply([[MSE]], XTXInv)
  const standardErrors = varCovar[0].map(Math.sqrt)
  const tValues = coefficients.map((coef, i) => coef / standardErrors[i])
  const pValues = tValues.map((t) => 2 * (1 - tCDF(Math.abs(t), n - p)))

  return {
    coefficients,
    rSquared,
    adjustedRSquared,
    standardErrors,
    tValues,
    pValues,
  }
}

// Matrix operations
function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]))
}

function multiply(A: number[][], B: number[][]): number[][] {
  const m = A.length
  const n = A[0].length
  const p = B[0].length
  const result: number[][] = Array(m)
    .fill(null)
    .map(() => Array(p).fill(0))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j]
      }
    }
  }
  return result
}

function inverse(matrix: number[][]): number[][] {
  const n = matrix.length
  const A = matrix.map((row) => [...row]) // Create a copy
  const identity = Array(n)
    .fill(null)
    .map(() => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    identity[i][i] = 1
  }

  for (let i = 0; i < n; i++) {
    let pivot = A[i][i]

    if (pivot === 0) {
      // Find a row below with a non-zero value in the same column
      for (let j = i + 1; j < n; j++) {
        if (A[j][i] !== 0) {
          // Swap rows
          ;[A[i], A[j]] = [A[j], A[i]]
          ;[identity[i], identity[j]] = [identity[j], identity[i]]
          pivot = A[i][i]
          break
        }
      }
      if (pivot === 0) {
        throw new Error("Matrix is singular and cannot be inverted.")
      }
    }

    // Divide the current row by the pivot
    for (let j = 0; j < n; j++) {
      A[i][j] /= pivot
      identity[i][j] /= pivot
    }

    // Eliminate other rows
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const factor = A[j][i]
        for (let k = 0; k < n; k++) {
          A[j][k] -= factor * A[i][k]
          identity[j][k] -= factor * identity[i][k]
        }
      }
    }
  }

  return identity
}

// Student's t-distribution CDF approximation
function tCDF(t: number, degreesOfFreedom: number): number {
  const w = t / Math.sqrt(degreesOfFreedom)
  const result = 0.5 + 0.5 * erf(w / Math.sqrt(2))
  return result
}

// Error function approximation (needed for tCDF)
function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  const t = 1.0 / (1.0 + p * x)
  const y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))))
  return sign * (1 - y * Math.exp(-x * x))
}

