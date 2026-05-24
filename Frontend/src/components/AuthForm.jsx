import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const MODE_LABELS = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to continue reporting.',
    action: 'Log in',
  },
  register: {
    title: 'Join the newsroom',
    subtitle: 'Create an account to publish updates.',
    action: 'Register',
  },
}

const initialForm = { username: '', password: '' }

export default function AuthForm({ onSuccess }) {
  const { login, register, authBusy } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (mode === 'login') {
        await login(form)
      } else {
        await register(form)
      }

      onSuccess?.()
    } catch (err) {
      setError(extractError(err))
    }
  }

  const labels = MODE_LABELS[mode]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-2xl text-slate-950">
          {labels.title}
        </h2>
        <p className="text-sm text-slate-600">{labels.subtitle}</p>
      </div>

      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className={mode === 'login' ? 'btn-chip-active' : 'btn-chip'}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'btn-chip-active' : 'btn-chip'}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            className="input"
            value={form.username}
            onChange={handleChange}
            placeholder="yourname"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="input"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button type="submit" className="btn-primary w-full" disabled={authBusy}>
          {authBusy ? 'Working...' : labels.action}
        </button>
      </form>
    </div>
  )
}

function extractError(err) {
  const message =
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    'Something went wrong. Please try again.'

  if (typeof message === 'string') {
    return message
  }

  return 'Something went wrong. Please try again.'
}
