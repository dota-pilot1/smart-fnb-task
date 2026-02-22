import {
  sessionStore,
  setSession,
  clearSession,
} from "@/entities/session/model/session-store";

// ─────────────────────────────────────────────────────────────────
// 커스텀 에러 클래스
// ─────────────────────────────────────────────────────────────────
interface ApiError {
  status: number;
  message: string;
}

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

// ─────────────────────────────────────────────────────────────────
// 내부 fetch 래퍼 (재시도 없이 순수 요청용)
// ─────────────────────────────────────────────────────────────────
async function rawFetch<T>(
  endpoint: string,
  options: RequestInit,
  token: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, { ...options, headers });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      status: response.status,
      message: response.statusText,
    }));
    throw new ApiClientError(error.status ?? response.status, error.message);
  }

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────
// Refresh Token으로 Access Token 재발급
// ─────────────────────────────────────────────────────────────────
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
}

let isRefreshing = false; // 중복 refresh 방지 플래그
let waitQueue: Array<(token: string) => void> = []; // 재발급 대기 큐

async function tryRefresh(): Promise<string | null> {
  const { refreshToken } = sessionStore.state;
  if (!refreshToken) return null;

  // 이미 refresh 중이면 큐에서 새 토큰 대기
  if (isRefreshing) {
    return new Promise((resolve) => {
      waitQueue.push((newToken) => resolve(newToken));
    });
  }

  isRefreshing = true;
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // Refresh Token도 만료된 경우 → 강제 로그아웃
      clearSession();
      window.location.href = "/login";
      return null;
    }

    const data: AuthResponse = await res.json();
    setSession(data.accessToken, data.refreshToken, data.name);

    // 대기 중인 요청들에 새 토큰 전달
    waitQueue.forEach((cb) => cb(data.accessToken));
    waitQueue = [];

    return data.accessToken;
  } finally {
    isRefreshing = false;
  }
}

// ─────────────────────────────────────────────────────────────────
// 메인 API 클라이언트 (401 발생 시 자동 retry)
// ─────────────────────────────────────────────────────────────────
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const { accessToken } = sessionStore.state;

  try {
    return await rawFetch<T>(endpoint, options, accessToken);
  } catch (error) {
    // 401 Unauthorized → refresh 시도 후 재요청
    if (error instanceof ApiClientError && error.status === 401) {
      const newToken = await tryRefresh();
      if (newToken) {
        return rawFetch<T>(endpoint, options, newToken);
      }
    }
    throw error;
  }
}
