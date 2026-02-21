import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import type { DevSpecTree } from "@/entities/devspec/model/types";

export function useDevSpecTree() {
  const [projects, setProjects] = useState<DevSpecTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient<DevSpecTree[]>("/api/devspec/projects");
      setProjects(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "프로젝트 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name: string) => {
    await apiClient<DevSpecTree>("/api/devspec/projects", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    await fetchProjects();
  };

  const createPage = async (projectId: number, name: string) => {
    await apiClient<DevSpecTree>(`/api/devspec/projects/${projectId}/pages`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    await fetchProjects();
  };

  const deleteNode = async (id: number) => {
    await apiClient<void>(`/api/devspec/${id}`, { method: "DELETE" });
    await fetchProjects();
  };

  const updateName = async (id: number, name: string) => {
    await apiClient<void>(`/api/devspec/${id}/name`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    await fetchProjects();
  };

  return { projects, loading, error, createProject, createPage, deleteNode, updateName, refresh: fetchProjects };
}
