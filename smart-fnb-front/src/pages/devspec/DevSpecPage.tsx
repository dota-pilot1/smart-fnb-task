import { useState, useEffect, useRef } from "react";
import { useStore } from "@tanstack/react-store";
import { useDevSpecTree } from "@/features/devspec/model/use-devspec-tree";
import { useDevSpecContent } from "@/features/devspec/model/use-devspec-content";
import { usePersistedState } from "@/shared/lib/use-persisted-state";
import { devspecStore, setSelectedNode } from "@/entities/devspec/model/devspec-store";
import { toast } from "sonner";
import { DevSpecTree } from "@/features/devspec/ui/DevSpecTree";
import { DevSpecDetail } from "@/features/devspec/ui/DevSpecDetail";
import type {
  DevSpecTree as TreeNode,
  ContentType,
  SpecStatus,
} from "@/entities/devspec/model/types";

export function DevSpecPage() {
  const {
    projects,
    loading,
    error,
    createProject,
    createPage,
    deleteNode,
    updateName,
  } = useDevSpecTree();
  const {
    detail,
    currentContent,
    fetchDetail,
    fetchContent,
    saveContent,
    updateStatus,
  } = useDevSpecContent();
  const selectedId = useStore(devspecStore, (s) => s.selectedId);
  const [persistedTreeWidth, setPersistedTreeWidth] = usePersistedState(
    "tree-width",
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
        toast("패널 너비가 저장되었습니다");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // localStorage에 저장된 선택 상태 복원: 프로젝트 목록 로드 완료 후 실행
  useEffect(() => {
    if (!loading && selectedId) {
      fetchDetail(selectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleTreeResizeStart = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleSelect = (node: TreeNode) => {
    setSelectedNode(node.id);
    fetchDetail(node.id);
  };

  const handleTabChange = (contentType: ContentType) => {
    if (selectedId) fetchContent(selectedId, contentType);
  };

  const handleSaveContent = async (
    contentType: ContentType,
    content: string,
  ) => {
    if (selectedId) await saveContent(selectedId, contentType, content);
  };

  const handleStatusChange = async (status: SpecStatus) => {
    if (selectedId) await updateStatus(selectedId, status);
  };

  const handleDelete = async (id: number) => {
    await deleteNode(id);
    if (selectedId === id) setSelectedNode(null);
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
        <DevSpecTree
          projects={projects}
          selectedId={selectedId}
          onSelect={handleSelect}
          onCreateProject={createProject}
          onCreatePage={createPage}
          onDelete={handleDelete}
          onRename={updateName}
        />
      </div>

      {/* 트리 드래그 핸들 */}
      <div
        onMouseDown={handleTreeResizeStart}
        className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors shrink-0"
      />

      {detail && selectedId ? (
        <DevSpecDetail
          detail={detail}
          currentContent={currentContent}
          onTabChange={handleTabChange}
          onSaveContent={handleSaveContent}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <p className="text-lg mb-2">업무 관리</p>
            <p className="text-sm">
              왼쪽에서 프로젝트 또는 페이지를 선택하세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
