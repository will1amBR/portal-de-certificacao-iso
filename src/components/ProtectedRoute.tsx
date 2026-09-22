import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

interface RoleProtectedRouteProps {
  allowedRoles?: Array<'cliente' | 'consultor' | 'admin'>
}

export function ProtectedRoute({ allowedRoles }: RoleProtectedRouteProps = {}) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = user?.role || 'cliente'
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <Outlet />
}

export function OnboardingRoute() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role === 'cliente' && (!user?.cnpj || !user?.business_model)) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
