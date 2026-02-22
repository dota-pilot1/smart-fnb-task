import { useState, useEffect } from "react";
import type {
  OrganizationTree,
  SelectedNode,
  Member,
} from "@/entities/organization";
import { AddMemberDialog } from "./AddMemberDialog";

interface OrgTreeProps {
  organizations: OrganizationTree[];
  selectedNode: SelectedNode | null;
  onSelectOrg: (id: number) => void;
  onSelectUser: (id: number) => void;
  onCreateRoot: (name: string) => void;
  onCreateChild: (parentId: number, name: string) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, name: string) => void;
  onAddMember: (orgId: number, userIds: number[]) => Promise<void>;
  fetchUnassignedUsers: () => Promise<Member[]>;
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className}>
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M11 2l3 3-8 8H3v-3L11 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 14c0-3 2.5-5 6-5s6 2 6 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserPlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1 14c0-2.5 2-4.5 5-4.5s5 2 5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 4v4M11 6h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActionBtn({
  onClick,
  title,
  hoverColor = "hover:text-blue-600 hover:bg-blue-50",
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  hoverColor?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-6 h-6 flex items-center justify-center rounded text-gray-400 transition-colors ${hoverColor}`}
    >
      {children}
    </button>
  );
}

function OrgNode({
  org,
  selectedNode,
  expanded,
  toggleExpand,
  onSelectOrg,
  onSelectUser,
  onCreateChild,
  onDelete,
  onRename,
  onAddMember,
  fetchUnassignedUsers,
}: {
  org: OrganizationTree;
  selectedNode: SelectedNode | null;
  expanded: Set<number>;
  toggleExpand: (id: number) => void;
  onSelectOrg: (id: number) => void;
  onSelectUser: (id: number) => void;
  onCreateChild: (parentId: number, name: string) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, name: string) => void;
  onAddMember: (orgId: number, userIds: number[]) => Promise<void>;
  fetchUnassignedUsers: () => Promise<Member[]>;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [addingChildFor, setAddingChildFor] = useState<number | null>(null);
  const [addingChildName, setAddingChildName] = useState("");
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  const isSelected = selectedNode?.type === "org" && selectedNode.id === org.id;
  const hasChildren = org.children.length > 0 || org.members.length > 0;
  const isExpanded = expanded.has(org.id);

  const handleRename = (id: number) => {
    if (!editingName.trim()) return;
    onRename(id, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  const handleAddChild = (parentId: number) => {
    if (!addingChildName.trim()) return;
    onCreateChild(parentId, addingChildName.trim());
    setAddingChildName("");
    setAddingChildFor(null);
  };

  return (
    <div className="mb-0.5">
      <div
        className={`flex items-center gap-1 px-1 py-1.5 rounded cursor-pointer group ${
          isSelected
            ? "bg-blue-50 text-blue-700"
            : "hover:bg-gray-100 text-gray-800"
        }`}
      >
        <button
          onClick={() => toggleExpand(org.id)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400 shrink-0"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <span className="w-4 h-4" />
          )}
        </button>

        {editingId === org.id ? (
          <input
            autoFocus
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename(org.id);
              if (e.key === "Escape") setEditingId(null);
            }}
            onBlur={() => handleRename(org.id)}
            className="flex-1 text-xs border border-gray-300 rounded px-1 py-0.5"
          />
        ) : (
          <span
            className="flex-1 truncate text-sm font-medium"
            onClick={() => onSelectOrg(org.id)}
          >
            {org.name}
          </span>
        )}

        <span className="text-xs text-gray-400 shrink-0">
          {org.members.length > 0 && `${org.members.length}`}
        </span>

        <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
          <ActionBtn
            title="하위 조직 추가"
            onClick={(e) => {
              e.stopPropagation();
              setAddingChildFor(org.id);
              toggleExpand(org.id);
            }}
          >
            <PlusIcon className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn
            title="멤버 추가"
            hoverColor="hover:text-green-600 hover:bg-green-50"
            onClick={(e) => {
              e.stopPropagation();
              setMemberDialogOpen(true);
            }}
          >
            <UserPlusIcon className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn
            title="이름 변경"
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(org.id);
              setEditingName(org.name);
            }}
          >
            <EditIcon className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn
            title="삭제"
            hoverColor="hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`"${org.name}" 조직을 삭제하시겠습니까?`))
                onDelete(org.id);
            }}
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </ActionBtn>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-5">
          {org.children.map((child) => (
            <OrgNode
              key={child.id}
              org={child}
              selectedNode={selectedNode}
              expanded={expanded}
              toggleExpand={toggleExpand}
              onSelectOrg={onSelectOrg}
              onSelectUser={onSelectUser}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
              onRename={onRename}
              onAddMember={onAddMember}
              fetchUnassignedUsers={fetchUnassignedUsers}
            />
          ))}

          {org.members.map((member) => {
            const isUserSelected =
              selectedNode?.type === "user" && selectedNode.id === member.id;
            return (
              <div
                key={`user-${member.id}`}
                onClick={() => onSelectUser(member.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                  isUserSelected
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                <span className="flex-1 truncate text-sm">{member.name}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {member.role === "ADMIN" ? "관리자" : "일반"}
                </span>
              </div>
            );
          })}

          {addingChildFor === org.id && (
            <div className="flex gap-1 px-2 py-1">
              <input
                autoFocus
                value={addingChildName}
                onChange={(e) => setAddingChildName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddChild(org.id);
                  if (e.key === "Escape") setAddingChildFor(null);
                }}
                placeholder="하위 조직명"
                className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAddChild(org.id)}
                className="text-xs text-blue-600 hover:text-blue-800 px-2"
              >
                추가
              </button>
            </div>
          )}
        </div>
      )}

      <AddMemberDialog
        open={memberDialogOpen}
        onClose={() => setMemberDialogOpen(false)}
        orgId={org.id}
        orgName={org.name}
        fetchUnassignedUsers={fetchUnassignedUsers}
        onAdd={onAddMember}
      />
    </div>
  );
}

export function OrgTree({
  organizations,
  selectedNode,
  onSelectOrg,
  onSelectUser,
  onCreateRoot,
  onCreateChild,
  onDelete,
  onRename,
  onAddMember,
  fetchUnassignedUsers,
}: OrgTreeProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showRootInput, setShowRootInput] = useState(false);
  const [rootName, setRootName] = useState("");

  useEffect(() => {
    if (organizations.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        organizations.forEach((o) => next.add(o.id));
        return next;
      });
    }
  }, [organizations]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddRoot = () => {
    if (!rootName.trim()) return;
    onCreateRoot(rootName.trim());
    setRootName("");
    setShowRootInput(false);
  };

  return (
    <div className="border-r border-gray-200 bg-white h-full flex flex-col">
      <div className="px-3 h-10 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">조직 관리</span>
        <button
          onClick={() => setShowRootInput(true)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          <PlusIcon className="w-3 h-3" />
          조직
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {showRootInput && (
          <div className="mb-2 flex gap-1">
            <input
              autoFocus
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddRoot();
                if (e.key === "Escape") setShowRootInput(false);
              }}
              placeholder="조직명"
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddRoot}
              className="text-xs text-blue-600 hover:text-blue-800 px-2"
            >
              추가
            </button>
          </div>
        )}

        {organizations.map((org) => (
          <OrgNode
            key={org.id}
            org={org}
            selectedNode={selectedNode}
            expanded={expanded}
            toggleExpand={toggleExpand}
            onSelectOrg={onSelectOrg}
            onSelectUser={onSelectUser}
            onCreateChild={onCreateChild}
            onDelete={onDelete}
            onRename={onRename}
            onAddMember={onAddMember}
            fetchUnassignedUsers={fetchUnassignedUsers}
          />
        ))}
      </div>
    </div>
  );
}
