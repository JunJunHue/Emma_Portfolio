export function newId(prefix: string): string {
  const slice = crypto.randomUUID().slice(0, 8);
  return `${prefix}-${slice}`;
}
