import { NavLink } from "react-router";
import { useStore } from "@tanstack/react-store";
import { sessionStore } from "@/entities/session";
import { useAuth } from "@/features/auth/model/use-auth";

const NAV_LINK_BASE =
  "relative text-sm font-medium transition-colors duration-200 px-1 py-0.5";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${NAV_LINK_BASE} text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-blue-600 after:rounded-full`
    : `${NAV_LINK_BASE} text-gray-500 hover:text-gray-900`;

export function AppHeader() {
  const token = useStore(sessionStore, (s) => s.accessToken);
  const displayName = useStore(sessionStore, (s) => s.displayName);
  const { logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-6 h-14 flex items-center justify-between">
        {/* 좌측: 로고 + 네비 */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-lg font-bold mr-4 transition-colors duration-200 ${
                isActive ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
              }`
            }
          >
            Smart F&amp;B
          </NavLink>

          <div className="flex items-center gap-1">
            <NavLink to="/devspec" className={navLinkClass}>
              업무 관리
            </NavLink>
            <NavLink to="/convention" className={navLinkClass}>
              코딩 컨벤션
            </NavLink>
            <NavLink to="/code-review" className={navLinkClass}>
              코드 리뷰
            </NavLink>
            <NavLink to="/pilot" className={navLinkClass}>
              파일럿 프로젝트
            </NavLink>
            <NavLink to="/chat" className={navLinkClass}>
              채팅
            </NavLink>
            <NavLink to="/board" className={navLinkClass}>
              게시판
            </NavLink>
            <NavLink to="/report" className={navLinkClass}>
              업무 레포트
            </NavLink>
            <NavLink to="/organization" className={navLinkClass}>
              조직 관리
            </NavLink>
          </div>
        </div>

        {/* 우측: 인증 */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm text-gray-700">
                {displayName}님 안녕하세요
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm transition-colors px-3 py-1.5 rounded-lg ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                로그인
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `text-sm px-4 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`
                }
              >
                회원가입
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* active 인디케이터 바 공간 */}
      <div className="h-[2px] bg-transparent" />
    </nav>
  );
}
