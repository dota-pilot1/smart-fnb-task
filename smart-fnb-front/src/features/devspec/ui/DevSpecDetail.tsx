import { useState, useEffect } from "react";
import type {
  ContentType,
  DevSpecDetail as DetailType,
} from "@/entities/devspec/model/types";
import type { SpecStatus } from "@/entities/devspec/model/types";
import { ContentTabs } from "./ContentTabs";
import { FigmaContent } from "./FigmaContent";
import { ChecklistContent } from "./ChecklistContent";
import { MermaidContent } from "./MermaidContent";
import { NoteContent } from "./NoteContent";

interface DevSpecDetailProps {
  detail: DetailType;
  currentContent: { contentType: ContentType; content: string } | null;
  onTabChange: (contentType: ContentType) => void;
  onSaveContent: (contentType: ContentType, content: string) => void;
  onStatusChange: (status: SpecStatus) => void;
}

const STATUS_OPTIONS: { value: SpecStatus; label: string; color: string }[] = [
  { value: "TODO", label: "TODO", color: "text-gray-600" },
  { value: "IN_PROGRESS", label: "IN PROGRESS", color: "text-amber-600" },
  { value: "DONE", label: "DONE", color: "text-green-600" },
];

export function DevSpecDetail({
  detail,
  currentContent,
  onTabChange,
  onSaveContent,
  onStatusChange,
}: DevSpecDetailProps) {
  const [activeTab, setActiveTab] = useState<ContentType>("CHECKLIST");

  useEffect(() => {
    if (detail.type === "PAGE") {
      onTabChange(activeTab);
    }
  }, [detail.id, activeTab]);

  const handleTabChange = (tab: ContentType) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const contentValue = currentContent?.content ?? "";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{detail.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
              {detail.type}
            </span>
            {detail.parentName && <span>상위: {detail.parentName}</span>}
            <span>생성: {new Date(detail.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <select
          value={detail.status}
          onChange={(e) => onStatusChange(e.target.value as SpecStatus)}
          className={`text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_OPTIONS.find((s) => s.value === detail.status)?.color
            }`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content Area */}
      {detail.type === "PAGE" ? (
        <div className="flex-1 flex flex-col overflow-auto">
          <ContentTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="flex-1 overflow-auto">
            {activeTab === "FIGMA" && <FigmaContent devSpecId={detail.id} />}
            {activeTab === "CHECKLIST" && (
              <ChecklistContent
                content={contentValue}
                onSave={(c) => onSaveContent("CHECKLIST", c)}
              />
            )}
            {activeTab === "MMD" && (
              <MermaidContent
                content={contentValue}
                onSave={(c) => onSaveContent("MMD", c)}
              />
            )}
            {activeTab === "NOTE" && <NoteContent devSpecId={detail.id} />}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              하위 페이지 현황
            </h3>
            {detail.contents.length === 0 && (
              <p className="text-sm text-gray-400">
                왼쪽 트리에서 페이지를 추가하세요.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
