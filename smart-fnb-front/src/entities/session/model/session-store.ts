import { Store } from "@tanstack/store";
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
  removeStoredRefreshToken,
  getStoredDisplayName,
  setStoredDisplayName,
  removeStoredDisplayName,
} from "@/shared/lib/storage";

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  displayName: string | null;
}

export const sessionStore = new Store<SessionState>({
  accessToken: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  displayName: getStoredDisplayName(),
});

export function setSession(
  accessToken: string,
  refreshToken: string,
  displayName: string,
) {
  setStoredToken(accessToken);
  setStoredRefreshToken(refreshToken);
  setStoredDisplayName(displayName);
  sessionStore.setState((prev) => ({
    ...prev,
    accessToken,
    refreshToken,
    displayName,
  }));
}

export function clearSession() {
  removeStoredToken();
  removeStoredRefreshToken();
  removeStoredDisplayName();
  sessionStore.setState((prev) => ({
    ...prev,
    accessToken: null,
    refreshToken: null,
    displayName: null,
  }));
}
