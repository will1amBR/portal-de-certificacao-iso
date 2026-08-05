import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  userRole: string
  isAuthenticated: boolean
  signUp: (
    email: string,
    password: string,
    name?: string,
    companyName?: string,
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInAsDemo: (email: string) => Promise<{ error: any; role: string | null }>
  signOut: () => void
  isDemoMode: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(pb.authStore.isValid ? pb.authStore.record : null)
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(
    () => localStorage.getItem('iso_demo_mode') === 'true',
  )

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? record : null)
      setIsAuthenticated(pb.authStore.isValid)
      if (!pb.authStore.isValid) {
        localStorage.removeItem('iso_demo_mode')
        setIsDemoMode(false)
      }
    })

    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name: name || '',
        role: 'cliente',
      })
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      localStorage.removeItem('iso_demo_mode')
      setIsDemoMode(false)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signInAsDemo = async (email: string) => {
    try {
      await pb.collection('users').authWithPassword(email, 'Skip@Pass')
      localStorage.setItem('iso_demo_mode', 'true')
      setIsDemoMode(true)
      return { error: null, role: (pb.authStore.record as any)?.role || null }
    } catch (error) {
      return { error, role: null }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    localStorage.removeItem('iso_demo_mode')
    setIsDemoMode(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole: user?.role || 'cliente',
        isAuthenticated,
        signUp,
        signIn,
        signInAsDemo,
        signOut,
        isDemoMode,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
