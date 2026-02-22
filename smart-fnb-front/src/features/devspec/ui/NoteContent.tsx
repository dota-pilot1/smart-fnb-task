import { useState, useEffect, useRef, useCallback } from "react";

interface NoteSection {
  title: string;
  body: string;
}

interface NoteContentProps {
  content: string;
  onSave: (content: string) => void;
}

function parseSections(content: string): NoteSection[] {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // 기존 단순 텍스트 → 단일 섹션으로 래핑
  }
  return content ? [{ title: "메모", body: content }] : [];
}

export function NoteContent({ content, onSave }: NoteContentProps) {
  const [sections, setSections] = useState<NoteSection[]>(
    parseSections(content),
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(
    sections.length > 0 ? 0 : null,
  );
  const [newTitle, setNewTitle] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const parsed = parseSections(content);
    setSections(parsed);
    setActiveIndex(parsed.length > 0 ? 0 : null);
  }, [content]);

  const save = useCallback(
    (updated: NoteSection[]) => {
      setSections(updated);
      onSave(JSON.stringify(updated));
    },
    [onSave],
  );

  const addSection = () => {
    if (!newTitle.trim()) return;
    const updated = [...sections, { title: newTitle.trim(), body: "" }];
    save(updated);
    setActiveIndex(updated.length - 1);
    setNewTitle("");
  };

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    save(updated);
    if (activeIndex === index) {
      setActiveIndex(
        updated.length > 0 ? Math.min(index, updated.length - 1) : null,
      );
    } else if (activeIndex !== null && activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const updateSectionTitle = (index: number, title: string) => {
    const updated = sections.map((s, i) => (i === index ? { ...s, title } : s));
    setSections(updated);
  };

  const updateSectionBody = (index: number, body: string) => {
    const updated = sections.map((s, i) => (i === index ? { ...s, body } : s));
    setSections(updated);
  };

  const saveSections = () => {
    onSave(JSON.stringify(sections));
  };

  const scrollToSection = (index: number) => {
    setActiveIndex(index);
    const el = sectionRefs.current.get(index);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 드래그 앤 드롭
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...sections];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setSections(updated);
    setDragIndex(index);
    if (activeIndex === dragIndex) setActiveIndex(index);
  };

  const handleDragEnd = () => {
    if (dragIndex !== null) {
      onSave(JSON.stringify(sections));
      setDragIndex(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* 좌측: 섹션별 에디터 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-12">
              오른쪽 목차에서 섹션을 추가하세요.
            </div>
          ) : (
            sections.map((section, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) sectionRefs.current.set(index, el);
                }}
                onClick={() => setActiveIndex(index)}
                className={`rounded-lg border transition-colors ${
                  activeIndex === index
                    ? "border-blue-400 bg-blue-50/30"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(index, e.target.value)}
                    onBlur={saveSections}
                    className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none w-full"
                  />
                </div>
                <textarea
                  value={section.body}
                  onChange={(e) => updateSectionBody(index, e.target.value)}
                  onBlur={saveSections}
                  placeholder="내용을 입력하세요..."
                  className="w-full text-sm font-mono p-4 resize-none bg-transparent border-none outline-none min-h-[150px]"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 우측: 목차 패널 */}
      <div className="w-56 border-l border-gray-200 bg-white shrink-0 flex flex-col">
        <div className="px-3 py-3 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            목차
          </h3>
        </div>

        <div className="p-2 border-b border-gray-200">
          <div className="flex gap-1">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSection();
              }}
              placeholder="섹션 추가..."
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={addSection}
              className="text-xs text-blue-600 hover:text-blue-800 px-2"
            >
              추가
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sections.map((section, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => scrollToSection(index)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm group ${
                activeIndex === index
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100 text-gray-600"
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
                  removeSection(index);
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
