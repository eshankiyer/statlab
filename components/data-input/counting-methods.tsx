"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CountingMethods() {
  const [n, setN] = useState("")
  const [r, setR] = useState("")
  const [result, setResult] = useState<string | null>(null)

  const factorial = (num: number): number => {
    if (num === 0) return 1
    return num * factorial(num - 1)
  }

  const calculateNPR = (n: number, r: number): number => {
    return factorial(n) / factorial(n - r)
  }

  const calculateNCR = (n: number, r: number): number => {
    return factorial(n) / (factorial(r) * factorial(n - r))
  }

  const handleCalculation = (type: "factorial" | "permutation" | "combination") => {
    const nNum = Number.parseInt(n)
    const rNum = Number.parseInt(r)

    if (type === "factorial") {
      if (isNaN(nNum) || nNum < 0) {
        setResult("Please enter a valid non-negative number for n")
        return
      }
      setResult(`${n}! = ${factorial(nNum)}`)
    } else {
      if (isNaN(nNum) || isNaN(rNum) || nNum < 0 || rNum < 0 || rNum > nNum) {
        setResult("Please enter valid values where n ≥ r ≥ 0")
        return
      }
      if (type === "permutation") {
        setResult(`P(${n},${r}) = ${calculateNPR(nNum, rNum)}`)
      } else {
        setResult(`C(${n},${r}) = ${calculateNCR(nNum, rNum)}`)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counting Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="n-value">n =</label>
            <Input id="n-value" type="number" value={n} onChange={(e) => setN(e.target.value)} min="0" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="r-value">r =</label>
            <Input id="r-value" type="number" value={r} onChange={(e) => setR(e.target.value)} min="0" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleCalculation("factorial")}>Calculate n!</Button>
          <Button onClick={() => handleCalculation("permutation")}>Calculate nPr</Button>
          <Button onClick={() => handleCalculation("combination")}>Calculate nCr</Button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-mono">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

