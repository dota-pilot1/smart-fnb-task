import { Store } from "@tanstack/store";

const SELECTED_ID_KEY = "devspec_selected_id";

interface DevSpecUIState {
  selectedId: number | null;
}

function getStoredSelectedId(): number | null {
  const saved = localStorage.getItem(SELECTED_ID_KEY);
  return saved ? Number(saved) : null;
}

export const devspecStore = new Store<DevSpecUIState>({
  selectedId: getStoredSelectedId(),
});

export function setSelectedNode(id: number | null) {
  if (id === null) {
    localStorage.removeItem(SELECTED_ID_KEY);
  } else {
    localStorage.setItem(SELECTED_ID_KEY, String(id));
  }
  devspecStore.setState((prev) => ({ ...prev, selectedId: id }));
}
