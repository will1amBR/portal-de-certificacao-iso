import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute, OnboardingRoute } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Certifications from './pages/Certifications'
import CertificationDetail from './pages/CertificationDetail'
import Onboarding from './pages/Onboarding'
import Templates from './pages/Templates'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route element={<OnboardingRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/certificacoes" element={<Certifications />} />
                <Route path="/certificacoes/:id" element={<CertificationDetail />} />
                <Route path="/modelos" element={<Templates />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
