export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function formatValue(value: any): string {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return String(value);
}

export function calculateStats(values: number[]) {
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return { sum, avg, min, max };
}
