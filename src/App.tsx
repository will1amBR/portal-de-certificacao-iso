import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute, OnboardingRoute } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Certifications from './pages/Certifications'
import CertificationDetail from './pages/CertificationDetail'
import Onboarding from './pages/Onboarding'
import Templates from './pages/Templates'
import AdminModels from './pages/AdminModels'
import OnboardingReport from './pages/OnboardingReport'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AdminIsoTypes from './pages/AdminIsoTypes'
import DocumentsPage from './pages/Documents'
import SchedulesPage from './pages/Schedules'
import AuditorPipesHub from './pages/AuditorPipesHub'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/iso-types" element={<AdminIsoTypes />} />
              <Route path="/consultor" element={<AuditorPipesHub />} />
              <Route path="/auditor" element={<AuditorPipesHub />} />
              <Route element={<OnboardingRoute />}>
                <Route path="/app" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/certificacoes" element={<Certifications />} />
                <Route path="/certificacoes/:id" element={<CertificationDetail />} />
                <Route path="/modelos" element={<Templates />} />
                <Route path="/admin/modelos" element={<AdminModels />} />
                <Route path="/documentos" element={<DocumentsPage />} />
                <Route path="/agendamentos" element={<SchedulesPage />} />
                <Route path="/relatorio-onboarding" element={<OnboardingReport />} />
                <Route path="/perfil" element={<Profile />} />
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
