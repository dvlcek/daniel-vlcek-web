export const PRIVACY_CHOICE_KEY = "dv_privacy_choice_v1";
export const PRIVACY_CHOICE_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export type PrivacyChoice = {
  version: 1;
  analytics: boolean;
  savedAt: number;
};

let sessionChoice: PrivacyChoice | null = null;
let storageUnavailable = false;

export function parsePrivacyChoice(raw: string | null, now = Date.now()): PrivacyChoice | null {
  if (!raw) return null;
  try {
    const choice = JSON.parse(raw) as Partial<PrivacyChoice> | null;
    if (
      !choice || choice.version !== 1 || typeof choice.analytics !== "boolean" ||
      typeof choice.savedAt !== "number" || !Number.isFinite(choice.savedAt) ||
      choice.savedAt > now || now - choice.savedAt >= PRIVACY_CHOICE_MAX_AGE
    ) return null;
    return choice as PrivacyChoice;
  } catch {
    return null;
  }
}

export function readPrivacyChoice(): PrivacyChoice | null {
  if (typeof window === "undefined") return null;
  if (storageUnavailable) return sessionChoice;
  try {
    return parsePrivacyChoice(window.localStorage.getItem(PRIVACY_CHOICE_KEY));
  } catch {
    return sessionChoice;
  }
}

export function savePrivacyChoice(analytics: boolean): PrivacyChoice {
  const choice: PrivacyChoice = { version: 1, analytics, savedAt: Date.now() };
  sessionChoice = choice;
  try {
    window.localStorage.setItem(PRIVACY_CHOICE_KEY, JSON.stringify(choice));
    storageUnavailable = false;
  } catch {
    storageUnavailable = true;
    // Browsers that block storage retain the choice for this page session.
  }
  return choice;
}

const publicTelemetryPaths = new Set(["/", "/contact", "/work", "/coming-soon", "/legal", "/privacy", "/cookies"]);

export function isPublicTelemetryPath(pathname: string | null): boolean {
  return pathname !== null && publicTelemetryPaths.has(pathname);
}

export function sanitizeTelemetryUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (!isPublicTelemetryPath(url.pathname)) return null;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}
