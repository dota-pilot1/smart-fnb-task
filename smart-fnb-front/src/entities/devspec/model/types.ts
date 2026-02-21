export type SpecType = "PROJECT" | "PAGE";
export type SpecStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type ContentType = "FIGMA" | "CHECKLIST" | "MMD" | "NOTE";

export interface DevSpecTree {
  id: number;
  name: string;
  type: SpecType;
  status: SpecStatus;
  sortOrder: number;
  depth: number;
  children: DevSpecTree[];
}

export interface DevSpecContent {
  id: number | null;
  contentType: ContentType;
  content: string;
}

export interface FigmaLink {
  id: number;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}

export interface CreateFigmaLinkRequest {
  title: string;
  description: string;
  url: string;
}

export interface DevSpecDetail {
  id: number;
  name: string;
  type: SpecType;
  status: SpecStatus;
  sortOrder: number;
  depth: number;
  parentId: number | null;
  parentName: string | null;
  createdAt: string;
  updatedAt: string;
  contents: DevSpecContent[];
}
