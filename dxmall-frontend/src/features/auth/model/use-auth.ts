import { useState } from "react";
import { useNavigate } from "react-router";
import { apiClient, ApiClientError } from "@/shared/api/client";
import {
  setSession,
  clearSession,
} from "@/entities/session/model/session-store";

interface AuthResponse {
  token: string;
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
      setSession(res.token, res.name);
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
      setSession(res.token, res.name);
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

  function logout() {
    clearSession();
    navigate("/login");
  }

  return { login, signup, logout, error, loading };
}
