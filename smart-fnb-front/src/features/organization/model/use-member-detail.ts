import { useState, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import type { Member, Role } from "@/entities/organization";

export function useMemberDetail() {
  const [member, setMember] = useState<Member | null>(null);

  const fetchMember = useCallback(async (userId: number) => {
    const data = await apiClient<Member>(`/api/organizations/members/${userId}`);
    setMember(data);
  }, []);

  const updateRole = useCallback(async (userId: number, role: Role) => {
    const data = await apiClient<Member>(`/api/organizations/members/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
    setMember(data);
  }, []);

  const clearMember = useCallback(() => setMember(null), []);

  return { member, fetchMember, updateRole, clearMember };
}
