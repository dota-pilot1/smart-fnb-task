import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import type { OrganizationTree, Member } from "@/entities/organization";

export function useOrganizationTree() {
  const [organizations, setOrganizations] = useState<OrganizationTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient<OrganizationTree[]>("/api/organizations");
      setOrganizations(data);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "조직 목록을 불러올 수 없습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const createRoot = async (name: string) => {
    await apiClient<OrganizationTree>("/api/organizations", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    await fetchOrganizations();
  };

  const createChild = async (parentId: number, name: string) => {
    await apiClient<OrganizationTree>(
      `/api/organizations/${parentId}/children`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
      },
    );
    await fetchOrganizations();
  };

  const deleteOrg = async (id: number) => {
    await apiClient<void>(`/api/organizations/${id}`, { method: "DELETE" });
    await fetchOrganizations();
  };

  const updateName = async (id: number, name: string) => {
    await apiClient<void>(`/api/organizations/${id}/name`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    await fetchOrganizations();
  };

  const assignUser = async (orgId: number, userId: number) => {
    await apiClient<void>(`/api/organizations/${orgId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    await fetchOrganizations();
  };

  const unassignUser = async (userId: number) => {
    await apiClient<void>(`/api/organizations/members/${userId}`, {
      method: "DELETE",
    });
    await fetchOrganizations();
  };

  const fetchUnassignedUsers = async () => {
    return await apiClient<Member[]>("/api/organizations/unassigned-users");
  };

  return {
    organizations,
    loading,
    error,
    createRoot,
    createChild,
    deleteOrg,
    updateName,
    assignUser,
    unassignUser,
    fetchUnassignedUsers,
    refresh: fetchOrganizations,
  };
}
