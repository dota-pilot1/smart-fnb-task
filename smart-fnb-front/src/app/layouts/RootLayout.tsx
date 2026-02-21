import { Link, Outlet } from "react-router";
import { useStore } from "@tanstack/react-store";
import { sessionStore } from "@/entities/session/model/session-store";
import { useAuth } from "@/features/auth/model/use-auth";

export function RootLayout() {
  const token = useStore(sessionStore, (s) => s.token);
  const displayName = useStore(sessionStore, (s) => s.displayName);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold text-gray-900">
              Smart F&B
            </Link>
            <Link
              to="/products"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              상품
            </Link>
            <Link
              to="/devspec"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              업무 관리
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <span className="text-sm text-gray-700">
                  {displayName}님 안녕하세요
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
