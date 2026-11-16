export function sanitizeNonNegativeInteger(value: string): string {
  return value.replace(/\D/g, "");
}