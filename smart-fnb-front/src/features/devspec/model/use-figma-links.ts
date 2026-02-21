import { useState, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import type {
  FigmaLink,
  CreateFigmaLinkRequest,
} from "@/entities/devspec/model/types";

export function useFigmaLinks(devSpecId: number) {
  const [links, setLinks] = useState<FigmaLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient<FigmaLink[]>(
        `/api/devspec/${devSpecId}/figma-links`,
      );
      setLinks(data);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Figma 링크를 불러올 수 없습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [devSpecId]);

  const createLink = async (request: CreateFigmaLinkRequest) => {
    await apiClient<FigmaLink>(`/api/devspec/${devSpecId}/figma-links`, {
      method: "POST",
      body: JSON.stringify(request),
    });
    await fetchLinks();
  };

  const deleteLink = async (linkId: number) => {
    await apiClient<void>(`/api/devspec/${devSpecId}/figma-links/${linkId}`, {
      method: "DELETE",
    });
    await fetchLinks();
  };

  const fetchLink = async (linkId: number) => {
    return apiClient<FigmaLink>(`/api/devspec/figma-links/${linkId}`);
  };

  const saveChecklist = async (linkId: number, content: string) => {
    return apiClient<FigmaLink>(
      `/api/devspec/figma-links/${linkId}/checklist`,
      {
        method: "PUT",
        body: JSON.stringify({ content }),
      },
    );
  };

  return {
    links,
    loading,
    error,
    fetchLinks,
    createLink,
    deleteLink,
    fetchLink,
    saveChecklist,
  };
}
