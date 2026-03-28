/**
 * API base is .../api; uploaded files are served from the same host without /api.
 */
export function getApiOrigin(): string {
  const base = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";
  const trimmed = base.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) {
    return trimmed.slice(0, -4) || "http://localhost:8000";
  }
  return trimmed;
}

export function resolveRemoteImageUrl(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const origin = getApiOrigin();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}
