function normalizeKey(s: string): string {
  return s.trim().toLowerCase();
}

export function skillsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].map(normalizeKey).sort();
  const sb = [...b].map(normalizeKey).sort();
  return sa.every((v, i) => v === sb[i]);
}
