import { useEffect, useRef, useState } from 'react'
import { Globe, Save, Loader2, RotateCcw, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  SiteContent,
  getSiteContent,
  saveSiteContent,
  uploadSiteLogo,
  removeSiteLogo,
} from '@/services/site_content'
import { invalidateSiteContentCache } from '@/hooks/use-site-content'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export function AdminSiteContent() {
  const { toast } = useToast()
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null)

  useEffect(() => {
    let active = true
    getSiteContent()
      .then((c) => {
        if (active) setContent(c)
      })
      .catch(() => {
        if (active) toast({ title: 'Erro ao carregar conteúdo do site', variant: 'destructive' })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [toast])

  if (loading || !content) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2 shrink-0" />
          Carregando conteúdo do site...
        </CardContent>
      </Card>
    )
  }

  const set = (patch: Partial<SiteContent>) => setContent({ ...content, ...patch })

  const handleSave = async () => {
    setSaving(true)
    try {
      // Se o admin escolheu um arquivo, envia primeiro (a URL gerada
      // substitui qualquer URL externa digitada no campo ao lado).
      if (pendingLogoFile) {
        const url = await uploadSiteLogo(pendingLogoFile)
        if (url) {
          content.branding.logoUrl = url
          setLogoPreview(null)
          setPendingLogoFile(null)
        }
      }
      await saveSiteContent(content)
      invalidateSiteContentCache()
      toast({ title: 'Conteúdo salvo', description: 'A landing já reflete as mudanças.' })
    } catch (err) {
      toast({
        title: 'Erro ao salvar',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveLogo = async () => {
    setLogoUploading(true)
    try {
      await removeSiteLogo()
      setLogoPreview(null)
      setPendingLogoFile(null)
      set({ branding: { ...content.branding, logoUrl: '', logoFile: '' } })
      invalidateSiteContentCache()
      toast({ title: 'Logo removido' })
    } catch (err) {
      toast({
        title: 'Erro ao remover logo',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setLogoUploading(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    try {
      const fresh = await getSiteContent()
      setContent(fresh)
      setLogoPreview(null)
      setPendingLogoFile(null)
      toast({ title: 'Alterações descartadas' })
    } catch {
      toast({ title: 'Erro ao recarregar', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#0055A4] shrink-0" />
            Conteúdo do Site
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Edite os textos da landing sem programação. As mudanças aparecem na home imediatamente
            após salvar.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
            className="h-10 whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4 mr-1.5 shrink-0" />
            Descartar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="h-10 whitespace-nowrap">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin shrink-0" />
            ) : (
              <Save className="h-4 w-4 mr-1.5 shrink-0" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marca da certificadora</CardTitle>
          <CardDescription>
            Nome exibido no header da landing, no rodapé e nos relatórios. O logo é opcional: se
            preenchido, substitui o selo ISO no topo da home.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Nome de exibição</label>
            <Input
              value={content.branding.orgName}
              onChange={(e) => set({ branding: { ...content.branding, orgName: e.target.value } })}
              placeholder="ALC Certificadora"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Logo (upload)</label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return
                  if (file.size > 2 * 1024 * 1024) {
                    toast({
                      title: 'Arquivo muito grande',
                      description: 'O logo deve ter no máximo 2 MB.',
                      variant: 'destructive',
                    })
                    return
                  }
                  setLogoPreview(URL.createObjectURL(file))
                  setPendingLogoFile(file)
                }}
              />
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Pré-visualização do logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : content.branding.logoUrl ? (
                    <img
                      src={content.branding.logoUrl}
                      alt="Logo atual"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center px-1">sem logo</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-[40px] whitespace-nowrap"
                    disabled={logoUploading || saving}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoUploading ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin shrink-0" />
                    ) : (
                      <Upload className="h-4 w-4 mr-1.5 shrink-0" />
                    )}
                    Enviar arquivo
                  </Button>
                  {(logoPreview || content.branding.logoUrl) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="min-h-[40px] whitespace-nowrap text-rose-600 hover:bg-rose-50"
                      disabled={logoUploading || saving}
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5 shrink-0" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                PNG, JPG, WEBP ou SVG até 2 MB. O logo substitui o selo ISO no topo da home.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                URL do logo (alternativa ao upload)
              </label>
              <Input
                value={content.branding.logoUrl}
                onChange={(e) =>
                  set({ branding: { ...content.branding, logoUrl: e.target.value } })
                }
                placeholder="https://.../logo.png"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Faixa de números do hero</CardTitle>
          <CardDescription>Os 3 destaques abaixo do título principal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.metrics.map((m, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Número {i + 1}</label>
                <Input
                  value={m.value}
                  onChange={(e) => {
                    const metrics = [...content.metrics]
                    metrics[i] = { ...m, value: e.target.value }
                    set({ metrics })
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Legenda {i + 1}</label>
                <Input
                  value={m.label}
                  onChange={(e) => {
                    const metrics = [...content.metrics]
                    metrics[i] = { ...m, label: e.target.value }
                    set({ metrics })
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Texto da seção Nosso Time</CardTitle>
          <CardDescription>Frase de apoio exibida acima dos membros do time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={2}
            value={content.team.headline}
            onChange={(e) => set({ team: { ...content.team, headline: e.target.value } })}
          />
          <div className="mt-4 space-y-4">
            {content.team.members.map((m, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Nome do membro {i + 1}
                  </label>
                  <Input
                    value={m.name}
                    onChange={(e) => {
                      const members = [...content.team.members]
                      members[i] = { ...m, name: e.target.value }
                      set({ team: { ...content.team, members } })
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Cargo {i + 1}</label>
                  <Input
                    value={m.role}
                    onChange={(e) => {
                      const members = [...content.team.members]
                      members[i] = { ...m, role: e.target.value }
                      set({ team: { ...content.team, members } })
                    }}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Mini bio {i + 1}</label>
                  <Textarea
                    rows={2}
                    value={m.bio}
                    onChange={(e) => {
                      const members = [...content.team.members]
                      members[i] = { ...m, bio: e.target.value }
                      set({ team: { ...content.team, members } })
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Depoimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Depoimentos</CardTitle>
          <CardDescription>Depoimentos exibidos na seção "Quem usa, certifica".</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.testimonials.map((t, i) => (
            <div key={i} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3">Depoimento {i + 1}</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Texto</label>
                  <Textarea
                    rows={3}
                    value={t.quote}
                    onChange={(e) => {
                      const testimonials = [...content.testimonials]
                      testimonials[i] = { ...t, quote: e.target.value }
                      set({ testimonials })
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nome</label>
                    <Input
                      value={t.name}
                      onChange={(e) => {
                        const testimonials = [...content.testimonials]
                        testimonials[i] = { ...t, name: e.target.value }
                        set({ testimonials })
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Cargo</label>
                    <Input
                      value={t.role}
                      onChange={(e) => {
                        const testimonials = [...content.testimonials]
                        testimonials[i] = { ...t, role: e.target.value }
                        set({ testimonials })
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
