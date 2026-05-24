export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-[-15%] top-[10%] h-[520px] w-[520px] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[20%] h-[520px] w-[520px] rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[15%] h-[280px] w-[280px] rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
        {children}
      </div>
    </div>
  )
}
