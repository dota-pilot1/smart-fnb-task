import { Store } from "@tanstack/store";
import type { SelectedNode } from "./types";

const SELECTED_KEY = "org_selected_node";

interface OrgUIState {
  selectedNode: SelectedNode | null;
}

function getStoredNode(): SelectedNode | null {
  const saved = localStorage.getItem(SELECTED_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as SelectedNode;
  } catch {
    return null;
  }
}

export const orgStore = new Store<OrgUIState>({
  selectedNode: getStoredNode(),
});

export function setSelectedNode(node: SelectedNode | null) {
  if (node === null) {
    localStorage.removeItem(SELECTED_KEY);
  } else {
    localStorage.setItem(SELECTED_KEY, JSON.stringify(node));
  }
  orgStore.setState((prev) => ({ ...prev, selectedNode: node }));
}
