export type Role = "USER" | "ADMIN";

export interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface OrganizationTree {
  id: number;
  name: string;
  sortOrder: number;
  depth: number;
  children: OrganizationTree[];
  members: Member[];
}

export type SelectedNode =
  | { type: "org"; id: number }
  | { type: "user"; id: number };
