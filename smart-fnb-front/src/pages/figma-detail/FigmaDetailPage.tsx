import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { apiClient } from "@/shared/api/client";
import type { FigmaLink } from "@/entities/devspec/model/types";
import { ChecklistContent } from "@/features/devspec/ui/ChecklistContent";

export function FigmaDetailPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<FigmaLink | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLink = useCallback(async () => {
    if (!linkId) return;
    try {
      setLoading(true);
      const data = await apiClient<FigmaLink>(
        `/api/devspec/figma-links/${linkId}`,
      );
      setLink(data);
    } catch {
      setLink(null);
    } finally {
      setLoading(false);
    }
  }, [linkId]);

  useEffect(() => {
    fetchLink();
  }, [fetchLink]);

  const handleSaveChecklist = async (content: string) => {
    if (!linkId) return;
    const updated = await apiClient<FigmaLink>(
      `/api/devspec/figma-links/${linkId}/checklist`,
      { method: "PUT", body: JSON.stringify({ content }) },
    );
    setLink(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        로딩 중...
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500">Figma 링크를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(link.url)}`;

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; 뒤로
        </button>
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {link.title}
        </h2>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-blue-500 hover:underline"
        >
          Figma에서 열기
        </a>
      </div>

      {/* 본문: 좌 iframe + 우 체크리스트 */}
      <div className="flex flex-1 min-h-0">
        {/* Figma iframe */}
        <div className="flex-1 bg-gray-100">
          <iframe
            src={embedUrl}
            className="w-full h-full border-none"
            allowFullScreen
          />
        </div>

        {/* 사이드 체크리스트 */}
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">체크리스트</h3>
          </div>
          <ChecklistContent
            content={link.checklist ?? ""}
            onSave={handleSaveChecklist}
          />
        </div>
      </div>
    </div>
  );
}
