import { useState } from "react";
import { useDevSpecTree } from "@/features/devspec/model/use-devspec-tree";
import { useDevSpecContent } from "@/features/devspec/model/use-devspec-content";
import { DevSpecTree } from "@/features/devspec/ui/DevSpecTree";
import { DevSpecDetail } from "@/features/devspec/ui/DevSpecDetail";
import type { DevSpecTree as TreeNode, ContentType, SpecStatus } from "@/entities/devspec/model/types";

export function DevSpecPage() {
  const { projects, loading, error, createProject, createPage, deleteNode, updateName } =
    useDevSpecTree();
  const { detail, currentContent, fetchDetail, fetchContent, saveContent, updateStatus } =
    useDevSpecContent();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (node: TreeNode) => {
    setSelectedId(node.id);
    fetchDetail(node.id);
  };

  const handleTabChange = (contentType: ContentType) => {
    if (selectedId) fetchContent(selectedId, contentType);
  };

  const handleSaveContent = async (contentType: ContentType, content: string) => {
    if (selectedId) await saveContent(selectedId, contentType, content);
  };

  const handleStatusChange = async (status: SpecStatus) => {
    if (selectedId) await updateStatus(selectedId, status);
  };

  const handleDelete = async (id: number) => {
    await deleteNode(id);
    if (selectedId === id) setSelectedId(null);
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
      <DevSpecTree
        projects={projects}
        selectedId={selectedId}
        onSelect={handleSelect}
        onCreateProject={createProject}
        onCreatePage={createPage}
        onDelete={handleDelete}
        onRename={updateName}
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
            <p className="text-sm">왼쪽에서 프로젝트 또는 페이지를 선택하세요</p>
          </div>
        </div>
      )}
    </div>
  );
}
