import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, Sparkles } from 'lucide-react'

const faqs = [
  {
    q: 'Quanto tempo leva para obter uma certificação ISO pela plataforma?',
    a: 'Com nossa metodologia automatizada, diagnósticos pré-configurados e suporte contínuo dos consultores, as empresas costumam concluir o processo em 2 a 4 meses, até 60% mais rápido do que consultorias tradicionais.',
  },
  {
    q: 'Como funcionam os 3 perfis da Demonstração?',
    a: 'Você pode testar a qualquer momento: Perfil Cliente (Construtora Horizonte) para enviar documentos e acompanhar progresso; Perfil Auditor (Ana Costa) para revisar não-conformidades e validar evidências; Perfil Certificadora (ALC) com funil de onboarding, pipeline de clientes e configuração global de modelos.',
  },
  {
    q: 'Quais normas ISO são atendidas?',
    a: 'Atualmente temos suporte completo e nativo a ISO 9001 (Gestão da Qualidade), ISO 14001 (Gestão Ambiental) e ISO 45001 (Saúde e Segurança Ocupacional), com possibilidade de certificar um Sistema de Gestão Integrado (SGI).',
  },
  {
    q: 'A plataforma já fornece templates prontos para o meu segmento?',
    a: 'Sim! Ao realizar o onboarding e selecionar seu modelo de negócio (Construtora, Mercado, Prestador de Serviços, Indústria, etc.), a plataforma gera automaticamente dezenas de tarefas, procedimentos, checklists e agendamentos prontos para uso.',
  },
  {
    q: 'Como funciona o sistema de Pipes e Kanban?',
    a: 'Inspirado em soluções líderes como o Pipefy, nosso módulo de Pipes permite gerenciar RNCs (Relatórios de Não-Conformidade), Ações Corretivas, Riscos e Auditorias com arraste e solte de cards, campos personalizados, anexos e prazos.',
  },
  {
    q: 'Os dados da minha empresa ficam seguros e em conformidade com a LGPD?',
    a: 'Sim, todos os dados e documentos passam por criptografia em trânsito e em repouso, com controle de acesso granular baseado em funções (RBAC) e logs de auditoria completos.',
  },
]

export function LandingFaq() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0055A4] text-xs font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5" /> Dúvidas Frequentes
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Perguntas & Respostas
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-2">
            Tudo o que você precisa saber sobre a plataforma e o processo de certificação
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-blue-300 data-[state=open]:bg-blue-50/20 transition-all"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-[#0055A4] py-4 text-sm md:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4 pt-1">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
