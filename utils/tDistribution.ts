// Approximates the cumulative distribution function (CDF) of the Student's t-distribution.
// This uses a simple approximation for demonstration purposes.  A more accurate
// implementation would likely involve numerical integration or a more sophisticated
// approximation.

export const tDistributionCDF = (t: number, df: number): number => {
  // Simple approximation - replace with a more accurate method if needed.
  // This is a placeholder and will not be highly accurate for all values.
  if (df <= 0) return 0 // Handle invalid degrees of freedom
  const x = t / Math.sqrt(df)
  return 0.5 * (1 + Math.tanh(x / Math.sqrt(2)))
}

