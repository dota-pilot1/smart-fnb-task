import { useState, useEffect, useRef, useCallback } from "react";
import { usePersistedState } from "@/shared/lib/use-persisted-state";
import { toast } from "sonner";
import { LexicalEditor } from "@/shared/ui/lexical/LexicalEditor";
import { useNoteSections } from "../model/use-note-sections";

interface NoteContentProps {
  devSpecId: number;
}

export function NoteContent({ devSpecId }: NoteContentProps) {
  const {
    sections,
    fetchSections,
    createSection,
    updateTitle,
    updateContent,
    deleteSection,
    reorderSections,
  } = useNoteSections();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // 리사이즈
  const [persistedTocWidth, setPersistedTocWidth] = usePersistedState(
    "note-toc-width",
    224,
  );
  const [tocWidth, setTocWidth] = useState(persistedTocWidth);
  const isResizing = useRef(false);
  const widthRef = useRef(tocWidth);

  useEffect(() => {
    fetchSections(devSpecId);
  }, [devSpecId, fetchSections]);

  useEffect(() => {
    if (sections.length > 0 && activeId === null) {
      setActiveId(sections[0].id);
    }
  }, [sections, activeId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(
        400,
        Math.max(150, window.innerWidth - e.clientX),
      );
      widthRef.current = newWidth;
      setTocWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setPersistedTocWidth(widthRef.current);
        toast.success("패널 너비가 저장되었습니다");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleAddSection = async () => {
    if (!newTitle.trim()) return;
    const created = await createSection(devSpecId, newTitle.trim());
    setActiveId(created.id);
    setNewTitle("");
  };

  const handleRemoveSection = async (sectionId: number) => {
    await deleteSection(sectionId);
    if (activeId === sectionId) {
      setActiveId(sections.length > 1 ? sections[0].id : null);
    }
  };

  const handleTitleBlur = async (sectionId: number, title: string) => {
    await updateTitle(sectionId, title);
  };

  // 1초 디바운스 저장
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleContentChange = useCallback(
    (sectionId: number, content: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateContent(sectionId, content);
      }, 1000);
    },
    [updateContent],
  );

  const scrollToSection = (id: number) => {
    setActiveId(id);
    const el = sectionRefs.current.get(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 드래그 앤 드롭
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    // 시각적 리오더는 sections 상태로 처리되므로 여기서는 허용만
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    const ids = reordered.map((s) => s.id!);
    await reorderSections(devSpecId, ids);
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="flex h-full">
      {/* 좌측: 섹션별 에디터 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-12">
              오른쪽 목차에서 섹션을 추가하세요.
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                ref={(el) => {
                  if (el && section.id) sectionRefs.current.set(section.id, el);
                }}
                onClick={() => section.id && setActiveId(section.id)}
                className={`rounded-lg border transition-colors ${activeId === section.id
                  ? "border-blue-400 bg-blue-50/30 dark:bg-blue-900/10"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  }`}
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <input
                    defaultValue={section.title ?? ""}
                    onBlur={(e) =>
                      section.id && handleTitleBlur(section.id, e.target.value)
                    }
                    className="text-sm font-semibold text-gray-800 dark:text-gray-100 bg-transparent border-none outline-none w-full"
                  />
                </div>
                <LexicalEditor
                  initialState={section.content}
                  onChange={(state) =>
                    section.id && handleContentChange(section.id, state)
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 리사이즈 핸들 */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          isResizing.current = true;
          widthRef.current = tocWidth;
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
        }}
        className="w-1 hover:w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize transition-colors shrink-0"
      />

      {/* 우측: 목차 패널 */}
      <div
        style={{ width: tocWidth }}
        className="border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 flex flex-col"
      >
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            목차
          </h3>
        </div>

        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-1">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSection();
              }}
              placeholder="섹션 추가..."
              className="flex-1 text-xs border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSection}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2"
            >
              추가
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => section.id && scrollToSection(section.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm group ${activeId === section.id
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                } ${dragIndex === index ? "opacity-50" : ""}`}
            >
              <span className="cursor-grab text-gray-300 group-hover:text-gray-400 text-xs">
                ⠿
              </span>
              <span className="flex-1 truncate">
                {section.title || "제목 없음"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (section.id) handleRemoveSection(section.id);
                }}
                className="hidden group-hover:block text-xs text-gray-400 hover:text-red-500"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
