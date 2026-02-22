import { useState } from "react";
import { useNavigate } from "react-router";
import { apiClient, ApiClientError } from "@/shared/api/client";
import {
  setSession,
  clearSession,
} from "@/entities/session/model/session-store";

// ─────────────────────────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────────────────────────
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────
export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(data: LoginRequest) {
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSession(res.accessToken, res.refreshToken, res.name);
      navigate("/");
    } catch (e) {
      if (e instanceof ApiClientError) {
        setError(e.message);
      } else {
        setError("로그인에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function signup(data: SignupRequest) {
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSession(res.accessToken, res.refreshToken, res.name);
      navigate("/");
    } catch (e) {
      if (e instanceof ApiClientError) {
        setError(e.message);
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      // 서버에 로그아웃 요청 → DB에서 refresh token 삭제
      await apiClient("/api/auth/logout", { method: "POST" });
    } catch {
      // 서버 오류여도 로컬 세션은 무조건 정리
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  return { login, signup, logout, error, loading };
}
