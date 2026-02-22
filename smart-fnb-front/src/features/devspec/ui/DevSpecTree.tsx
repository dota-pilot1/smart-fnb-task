import { useState, useEffect } from "react";
import type { DevSpecTree as TreeNode } from "@/entities/devspec/model/types";

interface DevSpecTreeProps {
  projects: TreeNode[];
  selectedId: number | null;
  onSelect: (node: TreeNode) => void;
  onCreateProject: (name: string) => void;
  onCreatePage: (projectId: number, name: string) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, name: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-gray-300",
  IN_PROGRESS: "bg-amber-400",
  DONE: "bg-green-500",
};

// ── 아이콘 SVG 컴포넌트 ──────────────────────────────────────────
function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M11 2l3 3-8 8H3v-3L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── 액션 버튼 공통 컴포넌트 ─────────────────────────────────────
function ActionBtn({
  onClick,
  title,
  hoverColor = "hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30",
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  hoverColor?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-6 h-6 flex items-center justify-center rounded text-gray-400 dark:text-gray-500 transition-colors ${hoverColor}`}
    >
      {children}
    </button>
  );
}

export function DevSpecTree({
  projects,
  selectedId,
  onSelect,
  onCreateProject,
  onCreatePage,
  onDelete,
  onRename,
}: DevSpecTreeProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [addingProjectName, setAddingProjectName] = useState("");

  useEffect(() => {
    if (projects.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        projects.forEach((p) => next.add(p.id));
        return next;
      });
    }
  }, [projects]);

  const [showProjectInput, setShowProjectInput] = useState(false);
  const [addingPageFor, setAddingPageFor] = useState<number | null>(null);
  const [addingPageName, setAddingPageName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddProject = () => {
    if (!addingProjectName.trim()) return;
    onCreateProject(addingProjectName.trim());
    setAddingProjectName("");
    setShowProjectInput(false);
  };

  const handleAddPage = (projectId: number) => {
    if (!addingPageName.trim()) return;
    onCreatePage(projectId, addingPageName.trim());
    setAddingPageName("");
    setAddingPageFor(null);
    setExpanded((prev) => new Set(prev).add(projectId));
  };

  const handleRename = (id: number) => {
    if (!editingName.trim()) return;
    onRename(id, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full flex flex-col">
      {/* 헤더 */}
      <div className="px-3 h-10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">업무 관리</span>
        <button
          onClick={() => setShowProjectInput(true)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <PlusIcon className="w-3 h-3" />
          프로젝트
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* 프로젝트 추가 인풋 */}
        {showProjectInput && (
          <div className="mb-2 flex gap-1">
            <input
              autoFocus
              value={addingProjectName}
              onChange={(e) => setAddingProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddProject();
                if (e.key === "Escape") setShowProjectInput(false);
              }}
              placeholder="프로젝트명"
              className="flex-1 text-xs border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddProject}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2"
            >
              추가
            </button>
          </div>
        )}

        {projects.map((project) => (
          <div key={project.id} className="mb-0.5">
            {/* ── 프로젝트 노드 ── */}
            <div
              className={`flex items-center gap-1 px-1 py-1.5 rounded cursor-pointer group ${selectedId === project.id
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
            >
              {/* 토글 화살표 - 클릭 영역 넉넉하게 */}
              <button
                onClick={() => toggleExpand(project.id)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 shrink-0"
              >
                {expanded.has(project.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* 프로젝트 이름 */}
              {editingId === project.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(project.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => handleRename(project.id)}
                  className="flex-1 text-xs border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded px-1 py-0.5"
                />
              ) : (
                <span
                  className="flex-1 truncate text-sm font-medium"
                  onClick={() => onSelect(project)}
                >
                  {project.name}
                </span>
              )}

              {/* 상태 도트 */}
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[project.status]}`}
              />

              {/* hover 시 액션 버튼 */}
              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                <ActionBtn
                  title="페이지 추가"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddingPageFor(project.id);
                    setExpanded((prev) => new Set(prev).add(project.id));
                  }}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </ActionBtn>
                <ActionBtn
                  title="이름 변경"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(project.id);
                    setEditingName(project.name);
                  }}
                >
                  <EditIcon className="w-3.5 h-3.5" />
                </ActionBtn>
                <ActionBtn
                  title="삭제"
                  hoverColor="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?`))
                      onDelete(project.id);
                  }}
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </ActionBtn>
              </div>
            </div>

            {/* ── 페이지 목록 ── */}
            {expanded.has(project.id) && (
              <div className="ml-5">
                {project.children.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group ${selectedId === page.id
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                  >
                    {/* 페이지 이름 */}
                    {editingId === page.id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(page.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => handleRename(page.id)}
                        className="flex-1 text-xs border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded px-1 py-0.5"
                      />
                    ) : (
                      <span
                        className="flex-1 truncate text-sm"
                        onClick={() => onSelect(page)}
                      >
                        {page.name}
                      </span>
                    )}

                    {/* 상태 도트 */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[page.status]}`}
                    />

                    {/* hover 시 액션 버튼 */}
                    <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                      <ActionBtn
                        title="이름 변경"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(page.id);
                          setEditingName(page.name);
                        }}
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                      </ActionBtn>
                      <ActionBtn
                        title="삭제"
                        hoverColor="hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`"${page.name}" 페이지를 삭제하시겠습니까?`))
                            onDelete(page.id);
                        }}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </ActionBtn>
                    </div>
                  </div>
                ))}

                {/* 페이지 추가 인풋 */}
                {addingPageFor === project.id && (
                  <div className="flex gap-1 px-2 py-1">
                    <input
                      autoFocus
                      value={addingPageName}
                      onChange={(e) => setAddingPageName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddPage(project.id);
                        if (e.key === "Escape") setAddingPageFor(null);
                      }}
                      placeholder="페이지명"
                      className="flex-1 text-xs border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddPage(project.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2"
                    >
                      추가
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
