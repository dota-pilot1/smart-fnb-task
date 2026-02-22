import { useState, useEffect } from "react";
import { CommonDialog } from "@/shared/ui/CommonDialog";
import type { Member } from "@/entities/organization";

interface AddMemberDialogProps {
  open: boolean;
  onClose: () => void;
  orgId: number;
  orgName: string;
  fetchUnassignedUsers: () => Promise<Member[]>;
  onAdd: (orgId: number, userIds: number[]) => Promise<void>;
}

export function AddMemberDialog({
  open,
  onClose,
  orgId,
  orgName,
  fetchUnassignedUsers,
  onAdd,
}: AddMemberDialogProps) {
  const [users, setUsers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelected(new Set());
    setLoading(true);
    fetchUnassignedUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [open, fetchUnassignedUsers]);

  const toggleUser = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      await onAdd(orgId, Array.from(selected));
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonDialog open={open} onClose={onClose} title={`${orgName} - 멤버 추가`}>
      {loading ? (
        <p className="text-sm text-gray-500 py-4 text-center">불러오는 중...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          모든 유저가 이미 조직에 배정되어 있습니다
        </p>
      ) : (
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.has(user.id)}
                onChange={() => toggleUser(user.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0 || submitting}
          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "추가 중..." : `${selected.size}명 추가`}
        </button>
      </div>
    </CommonDialog>
  );
}
