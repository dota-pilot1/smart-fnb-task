// 다크모드 상태를 localStorage + html.dark 클래스로 관리

const DARK_KEY = "smart_fnb_dark_mode";

function applyDark(isDark: boolean) {
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

// 저장된 설정 읽기 (없으면 시스템 설정 따름)
function getInitialDark(): boolean {
    const stored = localStorage.getItem(DARK_KEY);
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// 앱 시작 시 즉시 적용 (FOUC 방지)
const initialDark = getInitialDark();
applyDark(initialDark);

export function isDarkMode(): boolean {
    return document.documentElement.classList.contains("dark");
}

export function toggleDarkMode(): boolean {
    const next = !isDarkMode();
    applyDark(next);
    localStorage.setItem(DARK_KEY, String(next));
    return next;
}

export function setDarkMode(dark: boolean) {
    applyDark(dark);
    localStorage.setItem(DARK_KEY, String(dark));
}
