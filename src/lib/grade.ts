import type { ResultEntry } from '@/types';

export function getTotals(entries: ResultEntry[]) {
  const obtained = entries.reduce((s, e) => s + (Number(e.marks) || 0), 0);
  const total = entries.reduce((s, e) => s + (Number(e.totalMarks) || 0), 0);
  const pct = total > 0 ? (obtained / total) * 100 : 0;
  return { obtained, total, pct };
}

export function getGrade(pct: number): { grade: string; color: string } {
  if (pct >= 80) return { grade: 'A+', color: 'text-green-600' };
  if (pct >= 70) return { grade: 'A', color: 'text-green-500' };
  if (pct >= 60) return { grade: 'A-', color: 'text-blue-600' };
  if (pct >= 50) return { grade: 'B', color: 'text-blue-500' };
  if (pct >= 40) return { grade: 'C', color: 'text-yellow-600' };
  if (pct >= 33) return { grade: 'D', color: 'text-orange-500' };
  return { grade: 'F', color: 'text-red-500' };
}
