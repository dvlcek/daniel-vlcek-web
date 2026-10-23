export function safeErrorCode(error?: unknown): string {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  return typeof code === "string" && ["P2002", "P2025", "P2028", "P2034", "ETIMEDOUT", "ECONNRESET", "ECONNREFUSED"].includes(code) ? code : "unavailable";
}

export function logSecurityFailure(operation: string, error?: unknown): void {
  console.error("API operation failed", { operation, code: safeErrorCode(error) });
}
