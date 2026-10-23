export function safeErrorCode(error?: unknown): string {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (typeof code === "string" && ["P2002", "P2025", "P2028", "P2034", "ETIMEDOUT", "ECONNRESET", "ECONNREFUSED"].includes(code)) return code;
  const response = error && typeof error === "object" && "response" in error ? error.response : undefined;
  const status = response && typeof response === "object" && "status" in response ? response.status : code;
  return typeof status === "number" && [400, 401, 403, 404, 409, 410, 412, 429, 500, 502, 503, 504].includes(status) ? `HTTP_${status}` : "unavailable";
}

export function logSecurityFailure(operation: string, error?: unknown): void {
  console.error("API operation failed", { operation, code: safeErrorCode(error) });
}
