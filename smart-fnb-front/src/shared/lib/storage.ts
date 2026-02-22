const TOKEN_KEY = "smart_fnb_token";
const REFRESH_TOKEN_KEY = "smart_fnb_refresh_token";
const DISPLAY_NAME_KEY = "smart_fnb_display_name";

// ── Access Token ──────────────────────────────────
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Refresh Token ─────────────────────────────────
export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setStoredRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeStoredRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Display Name ──────────────────────────────────
export function getStoredDisplayName(): string | null {
  return localStorage.getItem(DISPLAY_NAME_KEY);
}

export function setStoredDisplayName(name: string): void {
  localStorage.setItem(DISPLAY_NAME_KEY, name);
}

export function removeStoredDisplayName(): void {
  localStorage.removeItem(DISPLAY_NAME_KEY);
}

