import { useState, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import type { DevSpecContent } from "@/entities/devspec/model/types";

export function useNoteSections() {
  const [sections, setSections] = useState<DevSpecContent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSections = useCallback(async (devSpecId: number) => {
    try {
      setLoading(true);
      const data = await apiClient<DevSpecContent[]>(
        `/api/devspec/${devSpecId}/note-sections`,
      );
      setSections(data);
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(
    async (devSpecId: number, title: string) => {
      const data = await apiClient<DevSpecContent>(
        `/api/devspec/${devSpecId}/note-sections`,
        {
          method: "POST",
          body: JSON.stringify({ title, content: "" }),
        },
      );
      setSections((prev) => [...prev, data]);
      return data;
    },
    [],
  );

  const updateTitle = useCallback(async (sectionId: number, title: string) => {
    const data = await apiClient<DevSpecContent>(
      `/api/devspec/note-sections/${sectionId}`,
      {
        method: "PUT",
        body: JSON.stringify({ title }),
      },
    );
    setSections((prev) => prev.map((s) => (s.id === sectionId ? data : s)));
    return data;
  }, []);

  const updateContent = useCallback(
    async (sectionId: number, content: string) => {
      const data = await apiClient<DevSpecContent>(
        `/api/devspec/note-sections/${sectionId}`,
        {
          method: "PUT",
          body: JSON.stringify({ content }),
        },
      );
      setSections((prev) => prev.map((s) => (s.id === sectionId ? data : s)));
      return data;
    },
    [],
  );

  const deleteSection = useCallback(async (sectionId: number) => {
    await apiClient<void>(`/api/devspec/note-sections/${sectionId}`, {
      method: "DELETE",
    });
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, []);

  const reorderSections = useCallback(
    async (devSpecId: number, ids: number[]) => {
      const data = await apiClient<DevSpecContent[]>(
        `/api/devspec/${devSpecId}/note-sections/reorder`,
        {
          method: "PUT",
          body: JSON.stringify({ ids }),
        },
      );
      setSections(data);
    },
    [],
  );

  return {
    sections,
    loading,
    fetchSections,
    createSection,
    updateTitle,
    updateContent,
    deleteSection,
    reorderSections,
  };
}
