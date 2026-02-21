import { useState, useEffect } from "react";

interface FigmaContentProps {
  content: string;
  onSave: (content: string) => void;
}

export function FigmaContent({ content, onSave }: FigmaContentProps) {
  const [url, setUrl] = useState(content);

  useEffect(() => {
    setUrl(content);
  }, [content]);

  const isFigmaUrl = url.includes("figma.com");
  const embedUrl = isFigmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
    : "";

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Figma URL 또는 이미지 URL을 입력하세요"
          className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => onSave(url)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          저장
        </button>
      </div>

      {url && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {isFigmaUrl ? (
            <iframe
              src={embedUrl}
              className="w-full"
              style={{ height: "500px" }}
              allowFullScreen
            />
          ) : url.match(/\.(png|jpg|jpeg|gif|svg|webp)(\?.*)?$/i) ? (
            <img src={url} alt="디자인 시안" className="max-w-full mx-auto" />
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Figma URL 또는 이미지 URL을 입력하면 미리보기가 표시됩니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
