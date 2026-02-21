import { useState, useEffect, useRef, useCallback } from "react";
import mermaid from "mermaid";

interface MermaidContentProps {
  content: string;
  onSave: (content: string) => void;
}

mermaid.initialize({ startOnLoad: false, theme: "default" });

export function MermaidContent({ content, onSave }: MermaidContentProps) {
  const [code, setCode] = useState(content);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(content);
  }, [content]);

  const renderDiagram = useCallback(async (mmdCode: string) => {
    if (!mmdCode.trim()) {
      setSvg("");
      setError(null);
      return;
    }
    try {
      const id = `mermaid-${Date.now()}`;
      const { svg: rendered } = await mermaid.render(id, mmdCode);
      setSvg(rendered);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "다이어그램 렌더링 오류");
      setSvg("");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => renderDiagram(code), 500);
    return () => clearTimeout(timer);
  }, [code, renderDiagram]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => onSave(code)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          저장
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4" style={{ minHeight: "400px" }}>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">에디터</span>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`graph TD\n  A[시작] --> B[끝]`}
            className="flex-1 text-sm font-mono border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">미리보기</span>
          <div
            ref={renderRef}
            className="flex-1 border border-gray-200 rounded-lg p-3 bg-white overflow-auto flex items-center justify-center"
          >
            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : svg ? (
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
              <p className="text-sm text-gray-400">
                Mermaid 문법을 입력하면 다이어그램이 표시됩니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
