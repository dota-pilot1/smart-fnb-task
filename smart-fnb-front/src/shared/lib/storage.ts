const TOKEN_KEY = "smart_fnb_token";
const DISPLAY_NAME_KEY = "smart_fnb_display_name";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredDisplayName(): string | null {
  return localStorage.getItem(DISPLAY_NAME_KEY);
}

export function setStoredDisplayName(name: string): void {
  localStorage.setItem(DISPLAY_NAME_KEY, name);
}

export function removeStoredDisplayName(): void {
  localStorage.removeItem(DISPLAY_NAME_KEY);
}
