import { useState } from "react";
import { NavLink } from "react-router";
import { useStore } from "@tanstack/react-store";
import { sessionStore } from "@/entities/session";
import { useAuth } from "@/features/auth/model/use-auth";
import { toggleDarkMode, isDarkMode } from "@/shared/lib/dark-mode";

const NAV_LINK_BASE =
  "relative text-sm font-medium transition-colors duration-200 px-1 py-0.5";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${NAV_LINK_BASE} text-blue-600 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-blue-600 after:rounded-full`
    : `${NAV_LINK_BASE} text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100`;

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppHeader() {
  const token = useStore(sessionStore, (s) => s.accessToken);
  const displayName = useStore(sessionStore, (s) => s.displayName);
  const { logout } = useAuth();
  const [dark, setDark] = useState(isDarkMode);

  const handleToggleDark = () => {
    const next = toggleDarkMode();
    setDark(next);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-6 h-14 flex items-center justify-between">
        {/* 좌측: 로고 + 네비 */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-lg font-bold mr-4 transition-colors duration-200 ${isActive
                ? "text-blue-600"
                : "text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
              }`
            }
          >
            Smart F&amp;B
          </NavLink>

          <div className="flex items-center gap-1">
            <NavLink to="/organization" className={navLinkClass}>
              조직 관리
            </NavLink>
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
          </div>
        </div>

        {/* 우측: 다크모드 토글 + 인증 */}
        <div className="flex items-center gap-3">
          {/* 다크모드 토글 */}
          <button
            onClick={handleToggleDark}
            title={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {token ? (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {displayName}님 안녕하세요
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm transition-colors px-3 py-1.5 rounded-lg ${isActive
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                로그인
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `text-sm px-4 py-1.5 rounded-lg transition-colors ${isActive
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
