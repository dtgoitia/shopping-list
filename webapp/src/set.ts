export function setBContainsSetA<T>(setA: Set<T>, setB: Set<T>): boolean {
  const reminder = new Set(setA);
  for (const itemA of setA) {
    if (setB.has(itemA)) {
      reminder.delete(itemA);
    }
  }
  const everyItemWereInB = Array.from(reminder).length === 0;

  return everyItemWereInB;
}
