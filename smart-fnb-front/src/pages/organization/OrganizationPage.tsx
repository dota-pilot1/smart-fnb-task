import { useState, useEffect, useRef } from "react";
import { useStore } from "@tanstack/react-store";
import { usePersistedState } from "@/shared/lib/use-persisted-state";
import { orgStore, setSelectedNode } from "@/entities/organization";
import { useOrganizationTree } from "@/features/organization/model/use-organization-tree";
import { useMemberDetail } from "@/features/organization/model/use-member-detail";
import { OrgTree } from "@/features/organization/ui/OrgTree";
import { MemberDetail } from "@/features/organization/ui/MemberDetail";
import { toast } from "sonner";

export function OrganizationPage() {
  const {
    organizations,
    loading,
    error,
    createRoot,
    createChild,
    deleteOrg,
    updateName,
  } = useOrganizationTree();
  const { member, fetchMember, updateRole, clearMember } = useMemberDetail();
  const selectedNode = useStore(orgStore, (s) => s.selectedNode);
  const [persistedTreeWidth, setPersistedTreeWidth] = usePersistedState(
    "org-tree-width",
    288,
  );
  const [treeWidth, setTreeWidth] = useState(persistedTreeWidth);
  const isResizing = useRef(false);
  const widthRef = useRef(treeWidth);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(500, Math.max(200, e.clientX));
      widthRef.current = newWidth;
      setTreeWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setPersistedTreeWidth(widthRef.current);
        toast.success("패널 너비가 저장되었습니다");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!loading && selectedNode?.type === "user") {
      fetchMember(selectedNode.id);
    }
  }, [loading]);

  const handleSelectOrg = (id: number) => {
    setSelectedNode({ type: "org", id });
    clearMember();
  };

  const handleSelectUser = (id: number) => {
    setSelectedNode({ type: "user", id });
    fetchMember(id);
  };

  const handleDelete = async (id: number) => {
    await deleteOrg(id);
    if (selectedNode?.type === "org" && selectedNode.id === id) {
      setSelectedNode(null);
    }
  };

  const handleRoleChange = async (userId: number, role: "USER" | "ADMIN") => {
    await updateRole(userId, role);
    toast.success("권한이 변경되었습니다");
  };

  const handleTreeResizeStart = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="shrink-0" style={{ width: treeWidth }}>
        <OrgTree
          organizations={organizations}
          selectedNode={selectedNode}
          onSelectOrg={handleSelectOrg}
          onSelectUser={handleSelectUser}
          onCreateRoot={createRoot}
          onCreateChild={createChild}
          onDelete={handleDelete}
          onRename={updateName}
        />
      </div>

      <div
        onMouseDown={handleTreeResizeStart}
        className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors shrink-0"
      />

      {selectedNode?.type === "user" && member ? (
        <MemberDetail member={member} onRoleChange={handleRoleChange} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">조직 관리</p>
            <p className="text-sm">
              왼쪽 트리에서 유저를 선택하면 상세 정보가 표시됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
