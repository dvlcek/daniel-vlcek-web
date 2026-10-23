import { Resend } from "resend";

// Preserve the SDK/templating architecture while bounding each outbound email request.
export class BoundedResend extends Resend {
  override fetchRequest<T>(path: string, options: RequestInit = {}) {
    return super.fetchRequest<T>(path, { ...options, signal: AbortSignal.timeout(10_000) });
  }
}
