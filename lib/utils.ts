import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// T-distribution calculation functions
export function calculateTDistribution(x: number, df: number): number {
  const pi = Math.PI
  const gamma = (n: number): number => {
    if (n === 1) return 1
    if (n === 0.5) return Math.sqrt(pi)
    return (n - 1) * gamma(n - 1)
  }

  const coefficient = gamma((df + 1) / 2) / (Math.sqrt(df * pi) * gamma(df / 2))
  const base = 1 + (x * x) / df
  return coefficient * Math.pow(base, -(df + 1) / 2)
}

// F-distribution calculation functions
export function calculateFDistribution(x: number, df1: number, df2: number): number {
  const pi = Math.PI
  const gamma = (n: number): number => {
    if (n === 1) return 1
    if (n === 0.5) return Math.sqrt(pi)
    return (n - 1) * gamma(n - 1)
  }

  const coefficient = Math.sqrt((Math.pow(df1 * x, df1) * Math.pow(df2, df2)) / Math.pow(df1 * x + df2, df1 + df2))
  const numerator = gamma((df1 + df2) / 2)
  const denominator = gamma(df1 / 2) * gamma(df2 / 2)

  return coefficient * (numerator / denominator)
}

