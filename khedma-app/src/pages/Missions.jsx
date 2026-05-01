import { useState } from 'react'
import { MapPin, Clock, DollarSign, Search, Filter, Zap, Heart, Share2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './Missions.css'

const MISSIONS = [
  { id:1,  co:'BatiAlg SARL',       sector:'BTP',          title:'Maçon Niveau 2',              city:'Alger Centre',  wilaya:'Alger',   pay:'3 500 DA/j',  dur:'5 jours',   type:'URGENT',  posted:'il y a 12 min', rating:4.7, reviews:23 },
  { id:2,  co:'RestoCorp',          sector:'Restauration', title:'Serveur / Serveuse',           city:'Hydra',         wilaya:'Alger',   pay:'45 000 DA/m', dur:'1 mois',    type:'CDD',     posted:'il y a 1h',    rating:4.2, reviews:8  },
  { id:3,  co:'LogisDZ',            sector:'Logistique',   title:'Préparateur de commandes',     city:'Rouiba',        wilaya:'Alger',   pay:'2 800 DA/j',  dur:'1 semaine', type:'INTÉRIM',  posted:'il y a 2h',    rating:3.9, reviews:15 },
  { id:4,  co:'EventPro Algérie',   sector:'Événementiel', title:'Agent d\'accueil événementiel',city:'Oran',          wilaya:'Oran',    pay:'2 500 DA/j',  dur:'2 jours',   type:'URGENT',  posted:'il y a 3h',    rating:4.8, reviews:31 },
  { id:5,  co:'FermeNord',          sector:'Agriculture',  title:'Agent de conditionnement',     city:'Mitidja',       wilaya:'Blida',   pay:'1 800 DA/j',  dur:'10 jours',  type:'JOURNALIER', posted:'il y a 4h', rating:4.1, reviews:6  },
  { id:6,  co:'CleanPro',           sector:'Nettoyage',    title:'Agent de nettoyage',           city:'Sétif',         wilaya:'Sétif',   pay:'2 200 DA/j',  dur:'3 semaines',type:'CDD',     posted:'il y a 5h',    rating:4.4, reviews:19 },
  { id:7,  co:'TechSupport DZ',     sector:'Informatique', title:'Technicien support niveau 1',  city:'El Biar',       wilaya:'Alger',   pay:'55 000 DA/m', dur:'2 mois',    type:'CDD',     posted:'hier',         rating:4.9, reviews:42 },
  { id:8,  co:'Supermarché El Amel',sector:'Commerce',     title:'Caissier / Caissière',         city:'Constantine',   wilaya:'Constantine', pay:'35 000 DA/m', dur:'1 mois', type:'INTÉRIM', posted:'hier',       rating:4.0, reviews:11 },
]

const SECTORS = ['Tous', 'BTP', 'Restauration', 'Logistique', 'Événementiel', 'Informatique', 'Commerce', 'Agriculture', 'Nettoyage']
const TYPES   = ['Tous', 'URGENT', 'CDD', 'INTÉRIM', 'JOURNALIER']

const TYPE_COLORS = {
  'URGENT':    { bg: 'rgba(255,107,107,0.15)', color: '#FF6B6B' },
  'CDD':       { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  'INTÉRIM':   { bg: 'rgba(116,185,255,0.15)', color: '#74B9FF' },
  'JOURNALIER':{ bg: 'rgba(255,209,102,0.15)', color: '#FFD166' },
}

export default function Missions() {
  const { user } = useAuth()
  const [search, setSearch]   = useState('')
  const [sector, setSector]   = useState('Tous')
  const [type, setType]       = useState('Tous')
  const [saved, setSaved]     = useState(new Set())
  const [applied, setApplied] = useState(new Set())

  const filtered = MISSIONS.filter(m => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.co.toLowerCase().includes(search.toLowerCase()) || m.city.toLowerCase().includes(search.toLowerCase())
    const matchSector = sector === 'Tous' || m.sector === sector
    const matchType   = type === 'Tous' || m.type === type
    return matchSearch && matchSector && matchType
  })

  const toggleSave = (id) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const applyNow   = (id) => setApplied(s => new Set(s).add(id))

  return (
    <div className="missions-page">
      <div className="missions-hero">
        <div className="container">
          <h1 className="missions-hero__title">
            Bonjour {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="missions-hero__sub">
            {filtered.length} mission{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} près de vous
          </p>

          {/* Search bar */}
          <div className="missions-search">
            <Search size={18} className="missions-search__icon" />
            <input
              className="missions-search__input"
              placeholder="Rechercher un poste, une entreprise, une ville…"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="missions-search__clear" onClick={() => setSearch('')}>×</button>
            )}
          </div>
        </div>
      </div>

      <div className="container missions-body">
        {/* Filters */}
        <div className="missions-filters">
          <div className="missions-filters__row">
            <Filter size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <span className="missions-filters__label">Secteur :</span>
            {SECTORS.map(s => (
              <button
                key={s}
                className={`filter-pill ${sector === s ? 'active' : ''}`}
                onClick={() => setSector(s)}
              >{s}</button>
            ))}
          </div>
          <div className="missions-filters__row" style={{ marginTop: 8 }}>
            <Zap size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <span className="missions-filters__label">Type :</span>
            {TYPES.map(t => (
              <button
                key={t}
                className={`filter-pill ${type === t ? 'active' : ''}`}
                onClick={() => setType(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Mission cards */}
        <div className="missions-grid">
          {filtered.length === 0 ? (
            <div className="missions-empty">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3>Aucune mission trouvée</h3>
              <p>Essayez d'autres filtres ou une autre recherche</p>
            </div>
          ) : filtered.map(m => (
            <div key={m.id} className="mission-card">
              <div className="mission-card__top">
                <div className="mission-card__co-wrap">
                  <div className="mission-card__avatar">
                    {m.co.charAt(0)}
                  </div>
                  <div>
                    <div className="mission-card__co">{m.co}</div>
                    <div className="mission-card__rating">
                      ⭐ {m.rating} <span>({m.reviews} avis)</span>
                    </div>
                  </div>
                </div>
                <div className="mission-card__actions">
                  <button
                    className={`mission-card__action ${saved.has(m.id) ? 'saved' : ''}`}
                    onClick={() => toggleSave(m.id)} title="Sauvegarder"
                  >
                    <Heart size={16} fill={saved.has(m.id) ? 'var(--coral)' : 'none'} color={saved.has(m.id) ? 'var(--coral)' : 'var(--muted)'} />
                  </button>
                  <button className="mission-card__action" title="Partager">
                    <Share2 size={16} color="var(--muted)" />
                  </button>
                </div>
              </div>

              <h3 className="mission-card__title">{m.title}</h3>

              <div className="mission-card__type-badge" style={TYPE_COLORS[m.type]}>
                {m.type === 'URGENT' && '⚡ '}{m.type}
              </div>

              <div className="mission-card__meta">
                <span><MapPin size={13} /> {m.city}, {m.wilaya}</span>
                <span><DollarSign size={13} /> {m.pay}</span>
                <span><Clock size={13} /> {m.dur}</span>
              </div>

              <div className="mission-card__footer">
                <span className="mission-card__posted">{m.posted}</span>
                {applied.has(m.id) ? (
                  <span className="mission-card__applied">✓ Candidature envoyée</span>
                ) : (
                  <button
                    className="btn-primary mission-card__apply"
                    onClick={() => applyNow(m.id)}
                  >
                    Postuler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
