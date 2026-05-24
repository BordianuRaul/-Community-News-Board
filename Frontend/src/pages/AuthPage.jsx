import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <section className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-rose-600" />
          Community News Desk
        </p>
        <h1 className="font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
          Report what matters in your community.
        </h1>
        <p className="max-w-xl text-lg text-slate-600">
          Share verified headlines, add context, and keep your neighborhood
          informed with a clean, modern bulletin built for mobile and desktop.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="panel p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Fast publishing
            </p>
            <p className="mt-2 text-slate-700">
              Create posts with images in seconds using secure uploads.
            </p>
          </div>
          <div className="panel p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Verified focus
            </p>
            <p className="mt-2 text-slate-700">
              Keep updates structured with clear headlines and timestamps.
            </p>
          </div>
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <AuthForm onSuccess={() => navigate('/', { replace: true })} />
      </section>
    </div>
  )
}
