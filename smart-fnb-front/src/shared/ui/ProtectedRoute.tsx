import { useStore } from '@tanstack/react-store'
import { Navigate, Outlet } from 'react-router'
import { sessionStore } from '@/entities/session/model/session-store'

export function ProtectedRoute() {
  const token = useStore(sessionStore, (s) => s.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
