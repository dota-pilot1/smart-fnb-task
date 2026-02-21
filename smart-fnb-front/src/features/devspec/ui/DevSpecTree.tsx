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
    <div className="border-r border-gray-200 bg-white h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">업무 관리</span>
        <button
          onClick={() => setShowProjectInput(true)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + 프로젝트
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
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
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={handleAddProject}
              className="text-xs text-blue-600"
            >
              추가
            </button>
          </div>
        )}

        {projects.map((project) => (
          <div key={project.id} className="mb-1">
            {/* Project Node */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm group ${
                selectedId === project.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              <button
                onClick={() => toggleExpand(project.id)}
                className="text-gray-400 w-4 text-xs"
              >
                {expanded.has(project.id) ? "v" : ">"}
              </button>

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
                  className="flex-1 text-xs border border-gray-300 rounded px-1 py-0.5"
                />
              ) : (
                <span
                  className="flex-1 truncate font-medium"
                  onClick={() => onSelect(project)}
                >
                  {project.name}
                </span>
              )}

              <span
                className={`w-2 h-2 rounded-full ${STATUS_COLORS[project.status]}`}
              />

              <div className="hidden group-hover:flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddingPageFor(project.id);
                    setExpanded((prev) => new Set(prev).add(project.id));
                  }}
                  className="text-[10px] text-gray-400 hover:text-blue-600"
                  title="페이지 추가"
                >
                  +
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(project.id);
                    setEditingName(project.name);
                  }}
                  className="text-[10px] text-gray-400 hover:text-blue-600"
                  title="이름 변경"
                >
                  e
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(`"${project.name}" 프로젝트를 삭제하시겠습니까?`)
                    )
                      onDelete(project.id);
                  }}
                  className="text-[10px] text-gray-400 hover:text-red-600"
                  title="삭제"
                >
                  x
                </button>
              </div>
            </div>

            {/* Children (Pages) */}
            {expanded.has(project.id) && (
              <div className="ml-4">
                {project.children.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm group ${
                      selectedId === page.id
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
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
                        className="flex-1 text-xs border border-gray-300 rounded px-1 py-0.5"
                      />
                    ) : (
                      <span
                        className="flex-1 truncate"
                        onClick={() => onSelect(page)}
                      >
                        {page.name}
                      </span>
                    )}

                    <span
                      className={`w-2 h-2 rounded-full ${STATUS_COLORS[page.status]}`}
                    />

                    <div className="hidden group-hover:flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(page.id);
                          setEditingName(page.name);
                        }}
                        className="text-[10px] text-gray-400 hover:text-blue-600"
                        title="이름 변경"
                      >
                        e
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(`"${page.name}" 페이지를 삭제하시겠습니까?`)
                          )
                            onDelete(page.id);
                        }}
                        className="text-[10px] text-gray-400 hover:text-red-600"
                        title="삭제"
                      >
                        x
                      </button>
                    </div>
                  </div>
                ))}

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
                      className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleAddPage(project.id)}
                      className="text-xs text-blue-600"
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
