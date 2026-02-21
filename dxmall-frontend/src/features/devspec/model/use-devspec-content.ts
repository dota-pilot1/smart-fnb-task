import { useState, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import type { ContentType, DevSpecContent, DevSpecDetail } from "@/entities/devspec/model/types";
import type { SpecStatus } from "@/entities/devspec/model/types";

export function useDevSpecContent() {
  const [detail, setDetail] = useState<DevSpecDetail | null>(null);
  const [currentContent, setCurrentContent] = useState<DevSpecContent | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data = await apiClient<DevSpecDetail>(`/api/devspec/${id}`);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContent = useCallback(async (id: number, contentType: ContentType) => {
    try {
      const data = await apiClient<DevSpecContent>(`/api/devspec/${id}/content/${contentType}`);
      setCurrentContent(data);
    } catch {
      setCurrentContent({ id: null, contentType, content: "" });
    }
  }, []);

  const saveContent = useCallback(async (id: number, contentType: ContentType, content: string) => {
    const data = await apiClient<DevSpecContent>(`/api/devspec/${id}/content/${contentType}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
    setCurrentContent(data);
  }, []);

  const updateStatus = useCallback(async (id: number, status: SpecStatus) => {
    await apiClient<void>(`/api/devspec/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    await fetchDetail(id);
  }, [fetchDetail]);

  return { detail, currentContent, loading, fetchDetail, fetchContent, saveContent, updateStatus };
}
