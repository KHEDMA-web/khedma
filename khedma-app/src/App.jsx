import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Missions  from './pages/Missions'
import Dashboard from './pages/Dashboard'
import Profil    from './pages/Profil'
import Contrat   from './pages/Contrat'

function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, fontFamily:'Syne,sans-serif' }}>
      <div style={{ fontSize:72 }}>🔍</div>
      <h1 style={{ fontSize:36, fontWeight:800, letterSpacing:'-1px' }}>Page introuvable</h1>
      <p style={{ color:'var(--muted)', fontSize:15 }}>Cette page n'existe pas.</p>
      <a href="/" style={{ color:'var(--green)', fontSize:15, marginTop:8 }}>← Retour à l'accueil</a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/missions"    element={<ProtectedRoute><Missions /></ProtectedRoute>} />
          <Route path="/dashboard"   element={<ProtectedRoute role="employer"><Dashboard /></ProtectedRoute>} />
          <Route path="/profil"      element={<ProtectedRoute><Profil /></ProtectedRoute>} />
          <Route path="/contrat"     element={<ProtectedRoute><Contrat /></ProtectedRoute>} />
          <Route path="/contrat/:id" element={<ProtectedRoute><Contrat /></ProtectedRoute>} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
