export function logSecurityFailure(operation: string, error?: unknown): void {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  const safeCode = typeof code === "string" && ["P2002", "P2025", "P2028", "P2034"].includes(code) ? code : "unavailable";
  console.error("API operation failed", { operation, code: safeCode });
}
