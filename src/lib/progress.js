export function computeReadiness(items) {
  const totalW = items.reduce((a, b) => a + (b.weight || 0), 0) || 1;
  const pct =
    items.reduce((sum, it) => sum + (it.score || 0) * (it.weight || 0), 0) /
    totalW;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
