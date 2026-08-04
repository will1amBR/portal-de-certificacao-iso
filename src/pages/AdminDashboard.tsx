import { Link } from 'react-router-dom'
import { Settings, FileText, LayoutDashboard } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AdminOverview } from '@/components/admin/AdminOverview'
import { AdminClients } from '@/components/admin/AdminClients'
import { AdminCertifications } from '@/components/admin/AdminCertifications'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-[#0055A4]" /> Área Administrativa
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestão completa da plataforma de certificação
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/modelos">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" /> Modelos e Templates
            </Button>
          </Link>
          <Link to="/admin/iso-types">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" /> Tipos ISO
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="certifications">Certificações</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <AdminOverview />
        </TabsContent>
        <TabsContent value="clients" className="mt-4">
          <AdminClients />
        </TabsContent>
        <TabsContent value="certifications" className="mt-4">
          <AdminCertifications />
        </TabsContent>
      </Tabs>
    </div>
  )
}
