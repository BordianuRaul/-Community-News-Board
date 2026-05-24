import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

const ToastContext = createContext(null)
const DEFAULT_DURATION = 4000

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const TONE_STYLES = {
  info: 'border-slate-200 bg-white/90 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
  error: 'border-rose-200 bg-rose-50/90 text-rose-900',
}

const DOT_STYLES = {
  info: 'bg-slate-400',
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const scheduleDismiss = useCallback(
    (id, duration) => {
      if (!duration || duration <= 0) {
        return
      }
      const timer = setTimeout(() => dismissToast(id), duration)
      timers.current.set(id, timer)
    },
    [dismissToast],
  )

  const showToast = useCallback(
    ({ message, tone = 'info', duration = DEFAULT_DURATION, isLoading } = {}) => {
      const id = createId()
      const toast = {
        id,
        message: message || '',
        tone,
        isLoading: Boolean(isLoading),
      }

      setToasts((prev) => [toast, ...prev].slice(0, 5))

      if (!toast.isLoading) {
        scheduleDismiss(id, duration)
      }

      return id
    },
    [scheduleDismiss],
  )

  const updateToast = useCallback(
    (id, updates = {}) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id
            ? { ...toast, ...updates, id: toast.id }
            : toast,
        ),
      )

      if (updates.duration || updates.isLoading === false) {
        scheduleDismiss(id, updates.duration || DEFAULT_DURATION)
      }
    },
    [scheduleDismiss],
  )

  const value = useMemo(
    () => ({ showToast, updateToast, dismissToast }),
    [showToast, updateToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-6 top-6 z-[60] flex w-[min(360px,90vw)] flex-col gap-3">
        {toasts.map((toast) => {
          const toneStyle = TONE_STYLES[toast.tone] || TONE_STYLES.info
          const dotStyle = DOT_STYLES[toast.tone] || DOT_STYLES.info

          return (
            <div
              key={toast.id}
              className={`panel border px-4 py-3 ${toneStyle}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-2 w-2 rounded-full ${dotStyle}`} />
                <div className="flex-1 text-sm font-semibold">
                  {toast.message}
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold uppercase text-slate-500"
                  onClick={() => dismissToast(toast.id)}
                >
                  X
                </button>
              </div>
              {toast.isLoading ? (
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/60">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-400/70" />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
