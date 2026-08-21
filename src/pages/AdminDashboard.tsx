import { Link } from 'react-router-dom'
import { Settings, FileText, LayoutDashboard } from 'lucide-react'
import { Users2, ShieldCheck, UserCheck, LayoutDashboard as DashboardIcon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AdminOverview } from '@/components/admin/AdminOverview'
import { AdminClients } from '@/components/admin/AdminClients'
import { AdminCertifications } from '@/components/admin/AdminCertifications'
import { AdminOnboardingPipeline } from '@/components/admin/AdminOnboardingPipeline'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-[#0055A4]" /> Gestão da ALC Certificadora
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Painel administrativo com pipeline de novos clientes, funil de contratação e
            certificações
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/modelos">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="h-4 w-4 text-[#0055A4]" /> Modelos & Templates
            </Button>
          </Link>
          <Link to="/admin/iso-types">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileText className="h-4 w-4 text-[#0055A4]" /> Tipos ISO
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 border border-slate-200">
          <TabsTrigger
            value="pipeline"
            className="gap-1.5 data-[state=active]:bg-[#0055A4] data-[state=active]:text-white"
          >
            <Users2 className="h-4 w-4" /> Pipeline de Onboarding & Novos Clientes
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="gap-1.5 data-[state=active]:bg-[#0055A4] data-[state=active]:text-white"
          >
            <DashboardIcon className="h-4 w-4" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="gap-1.5 data-[state=active]:bg-[#0055A4] data-[state=active]:text-white"
          >
            <UserCheck className="h-4 w-4" /> Base de Usuários
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="gap-1.5 data-[state=active]:bg-[#0055A4] data-[state=active]:text-white"
          >
            <ShieldCheck className="h-4 w-4" /> Certificações Ativas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4 focus-visible:outline-none">
          <AdminOnboardingPipeline />
        </TabsContent>

        <TabsContent value="overview" className="mt-4 focus-visible:outline-none">
          <AdminOverview />
        </TabsContent>

        <TabsContent value="clients" className="mt-4 focus-visible:outline-none">
          <AdminClients />
        </TabsContent>

        <TabsContent value="certifications" className="mt-4 focus-visible:outline-none">
          <AdminCertifications />
        </TabsContent>
      </Tabs>
    </div>
  )
}
