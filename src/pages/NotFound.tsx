/* 404 Page - Displays when a user attempts to access a non-existent route - translate to the language of the user */
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="inline-flex p-3 rounded-xl bg-blue-50 text-[#0055A4] font-black text-2xl mb-4">
          ISO
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Página não encontrada</h2>
        <p className="text-sm text-slate-500 mb-6">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#0055A4] hover:bg-[#1A73E8] text-white text-sm font-semibold transition-colors"
        >
          Voltar para o Início
        </a>
      </div>
    </div>
  )
}

export default NotFound
