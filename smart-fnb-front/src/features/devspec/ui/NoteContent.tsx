import { useState, useEffect } from "react";

interface NoteContentProps {
  content: string;
  onSave: (content: string) => void;
}

export function NoteContent({ content, onSave }: NoteContentProps) {
  const [text, setText] = useState(content);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setText(content);
  }, [content]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(false)}
            className={`px-3 py-1 text-xs rounded ${
              !preview ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            편집
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`px-3 py-1 text-xs rounded ${
              preview ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            미리보기
          </button>
        </div>
        <button
          onClick={() => onSave(text)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          저장
        </button>
      </div>

      {preview ? (
        <div
          className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 min-h-[400px] bg-white whitespace-pre-wrap"
        >
          {text || "내용이 없습니다."}
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="마크다운으로 메모를 작성하세요..."
          className="w-full text-sm font-mono border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ minHeight: "400px" }}
        />
      )}
    </div>
  );
}
