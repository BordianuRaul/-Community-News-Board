import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layout/AppShell'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import { useAuth } from './hooks/useAuth'

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
