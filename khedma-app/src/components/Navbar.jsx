import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Briefcase } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const handleLogout = () => { logout(); navigate('/') }

  const isLanding = location.pathname === '/'

  return (
    <nav className={`navbar ${scrolled || !isLanding ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <Briefcase size={20} strokeWidth={2.5} />
          K<span>H</span>EDMA
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {isLanding && (
            <>
              <li><a href="#solution">Solution</a></li>
              <li><a href="#marche">Marché</a></li>
              <li><a href="#modele">Modèle</a></li>
            </>
          )}
          {user && (
            <>
              <li><Link to="/missions">Missions</Link></li>
              {user.role === 'employer' && <li><Link to="/dashboard">Dashboard</Link></li>}
              <li><Link to="/contrat">Contrats</Link></li>
              <li><Link to="/profil">Mon profil</Link></li>
            </>
          )}
        </ul>

        <div className="navbar__actions">
          {user ? (
            <>
              <span className="navbar__welcome">👋 {user.name}</span>
              <button className="btn-ghost btn--sm" onClick={handleLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost btn--sm">Connexion</Link>
              <Link to="/login" className="btn-primary btn--sm">Commencer</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="navbar__burger" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="navbar__mobile">
          {isLanding && (
            <>
              <a href="#solution" onClick={() => setOpen(false)}>Solution</a>
              <a href="#marche" onClick={() => setOpen(false)}>Marché</a>
              <a href="#modele" onClick={() => setOpen(false)}>Modèle</a>
            </>
          )}
          {user ? (
            <>
              <Link to="/missions">Missions</Link>
              {user.role === 'employer' && <Link to="/dashboard">Dashboard</Link>}
              <Link to="/profil">Mon profil</Link>
              <button onClick={handleLogout} style={{ color: 'var(--coral)', background:'none', border:'none', textAlign:'left', fontSize:15, padding:0 }}>Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/login" className="btn-primary" style={{ marginTop: 8 }}>Commencer</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
