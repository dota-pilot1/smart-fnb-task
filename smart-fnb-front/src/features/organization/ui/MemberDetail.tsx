import type { Member, Role } from "@/entities/organization";

interface MemberDetailProps {
  member: Member;
  onRoleChange: (userId: number, role: Role) => void;
  onUnassign: (userId: number) => void;
}

export function MemberDetail({
  member,
  onRoleChange,
  onUnassign,
}: MemberDetailProps) {
  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">유저 정보</h2>

        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">이름</span>
            <span className="text-sm font-medium text-gray-900">
              {member.name}
            </span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">이메일</span>
            <span className="text-sm font-medium text-gray-900">
              {member.email}
            </span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">권한</span>
            <select
              value={member.role}
              onChange={(e) => onRoleChange(member.id, e.target.value as Role)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="USER">일반 (USER)</option>
              <option value="ADMIN">관리자 (ADMIN)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm(`"${member.name}" 님을 조직에서 제거하시겠습니까?`))
              onUnassign(member.id);
          }}
          className="mt-4 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          조직에서 제거
        </button>
      </div>
    </div>
  );
}
