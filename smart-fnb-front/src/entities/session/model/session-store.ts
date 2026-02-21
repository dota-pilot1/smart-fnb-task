import { Store } from "@tanstack/store";
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredDisplayName,
  setStoredDisplayName,
  removeStoredDisplayName,
} from "@/shared/lib/storage";

interface SessionState {
  token: string | null;
  displayName: string | null;
}

export const sessionStore = new Store<SessionState>({
  token: getStoredToken(),
  displayName: getStoredDisplayName(),
});

export function setSession(token: string, displayName: string) {
  setStoredToken(token);
  setStoredDisplayName(displayName);
  sessionStore.setState((prev) => ({ ...prev, token, displayName }));
}

export function clearSession() {
  removeStoredToken();
  removeStoredDisplayName();
  sessionStore.setState((prev) => ({
    ...prev,
    token: null,
    displayName: null,
  }));
}
