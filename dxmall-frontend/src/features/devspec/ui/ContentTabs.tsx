import type { ContentType } from "@/entities/devspec/model/types";

interface ContentTabsProps {
  activeTab: ContentType;
  onTabChange: (tab: ContentType) => void;
}

const TABS: { key: ContentType; label: string }[] = [
  { key: "FIGMA", label: "Figma" },
  { key: "CHECKLIST", label: "Checklist" },
  { key: "MMD", label: "Mermaid" },
  { key: "NOTE", label: "Note" },
];

export function ContentTabs({ activeTab, onTabChange }: ContentTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
