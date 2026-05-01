import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, MapPin, Star, Briefcase, CheckCircle, Edit3, Save, X, Phone, Shield, TrendingUp } from 'lucide-react'
import './Profil.css'

const SKILLS_OPTIONS = [
  'Maçonnerie', 'Plomberie', 'Électricité', 'Peinture', 'Carrelage',
  'Conduite poids lourd', 'Cuisine', 'Service en salle', 'Caisse',
  'Logistique', 'Magasinage', 'Informatique', 'Sécurité', 'Nettoyage',
  'Jardinage', 'Événementiel', 'Secrétariat', 'Comptabilité',
]

const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna',
  'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Skikda',
]

const MISSION_HISTORY = [
  { id:1, title:'Maçon — BatiAlg', city:'Alger Centre', pay:'3 500 DA/j', dur:'5 jours', rating:5, date:'Avril 2026', status:'completed' },
  { id:2, title:'Serveur — RestoCorp', city:'Hydra', pay:'45 000 DA/m', dur:'1 mois', rating:4, date:'Mars 2026', status:'completed' },
  { id:3, title:'Agent logistique', city:'Rouiba', pay:'2 800 DA/j', dur:'3 jours', rating:5, date:'Fév. 2026', status:'completed' },
]

const STARS = (n) => Array.from({ length: 5 }, (_, i) => i < n ? '⭐' : '☆').join('')

export default function Profil() {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [available, setAvailable] = useState(true)
  const [form, setForm] = useState({
    name:   user?.name || '',
    wilaya: 'Alger',
    bio:    'Travailleur motivé avec 3 ans d\'expérience dans le BTP et la logistique. Disponible immédiatement pour missions courtes ou longues.',
    skills: ['Maçonnerie', 'Logistique', 'Conduite poids lourd'],
  })
  const [saved, setSaved] = useState(false)

  const toggleSkill = (s) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s]
    }))
  }

  const handleSave = () => {
    login({ ...user, name: form.name })
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const stats = [
    { icon: <Briefcase size={18} />, label: 'Missions', val: MISSION_HISTORY.length },
    { icon: <Star size={18} />,      label: 'Note moy.',  val: '4,7 ⭐' },
    { icon: <CheckCircle size={18}/>, label: 'Complétées', val: '100%' },
    { icon: <TrendingUp size={18}/>,  label: 'Fiabilité',  val: '98%' },
  ]

  return (
    <div className="profil-page">
      <div className="profil-hero">
        <div className="container">
          {/* Header card */}
          <div className="profil-header">
            <div className="profil-avatar">
              {(form.name || 'U').charAt(0).toUpperCase()}
              <div className={`profil-available-dot ${available ? 'on' : 'off'}`} title={available ? 'Disponible' : 'Non disponible'} />
            </div>
            <div className="profil-header__info">
              {editing ? (
                <input
                  className="profil-name-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Votre nom complet"
                />
              ) : (
                <h1 className="profil-name">{form.name}</h1>
              )}
              <div className="profil-meta">
                <span><Phone size={13} /> {user?.phone}</span>
                <span><MapPin size={13} /> {form.wilaya}</span>
                <span><Shield size={13} /> Profil vérifié</span>
              </div>
              <div className="profil-role-badge">
                {user?.role === 'worker' ? '👷 Travailleur' : '🏢 Employeur'}
              </div>
            </div>
            <div className="profil-header__actions">
              <button
                className={`profil-available-btn ${available ? 'active' : ''}`}
                onClick={() => setAvailable(a => !a)}
              >
                <span className="profil-available-btn__dot" />
                {available ? 'Disponible' : 'Non disponible'}
              </button>
              {editing ? (
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn-primary" onClick={handleSave}><Save size={15} /> Sauvegarder</button>
                  <button className="btn-ghost" onClick={() => setEditing(false)}><X size={15} /></button>
                </div>
              ) : (
                <button className="btn-ghost" onClick={() => setEditing(true)}><Edit3 size={15} /> Modifier</button>
              )}
            </div>
          </div>

          {saved && (
            <div className="profil-saved-toast">✓ Profil mis à jour avec succès</div>
          )}

          {/* Stats row */}
          <div className="profil-stats">
            {stats.map(s => (
              <div key={s.label} className="profil-stat">
                <div className="profil-stat__icon">{s.icon}</div>
                <div className="profil-stat__val">{s.val}</div>
                <div className="profil-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container profil-body">
        <div className="profil-grid">

          {/* LEFT — infos */}
          <div className="profil-left">

            {/* Bio */}
            <div className="profil-section">
              <h2 className="profil-section__title">À propos</h2>
              {editing ? (
                <textarea
                  className="profil-textarea"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={4}
                  placeholder="Décrivez votre expérience, vos points forts…"
                />
              ) : (
                <p className="profil-bio">{form.bio}</p>
              )}
            </div>

            {/* Wilaya */}
            {editing && (
              <div className="profil-section">
                <h2 className="profil-section__title">Wilaya de résidence</h2>
                <select
                  className="profil-select"
                  value={form.wilaya}
                  onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))}
                >
                  {WILAYAS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            )}

            {/* Compétences */}
            <div className="profil-section">
              <h2 className="profil-section__title">Compétences</h2>
              {editing ? (
                <div className="skills-picker">
                  {SKILLS_OPTIONS.map(s => (
                    <button
                      key={s}
                      className={`skill-tag ${form.skills.includes(s) ? 'selected' : ''}`}
                      onClick={() => toggleSkill(s)}
                    >{s}</button>
                  ))}
                </div>
              ) : (
                <div className="skills-display">
                  {form.skills.length ? form.skills.map(s => (
                    <span key={s} className="skill-badge">{s}</span>
                  )) : <span style={{ color:'var(--muted)', fontSize:14 }}>Aucune compétence ajoutée</span>}
                </div>
              )}
            </div>

            {/* Contrat numérique */}
            <div className="profil-section">
              <div className="profil-contract-card">
                <div className="profil-contract-card__icon">📄</div>
                <div>
                  <div className="profil-contract-card__title">Contrat numérique activé</div>
                  <div className="profil-contract-card__sub">Vos contrats KHEDMA sont générés, signés et archivés automatiquement. Valeur juridique garantie.</div>
                </div>
                <span className="badge badge-green">Actif</span>
              </div>
            </div>
          </div>

          {/* RIGHT — historique */}
          <div className="profil-right">
            <div className="profil-section">
              <h2 className="profil-section__title">Historique des missions</h2>
              <div className="mission-history">
                {MISSION_HISTORY.map(m => (
                  <div key={m.id} className="history-card">
                    <div className="history-card__top">
                      <div>
                        <div className="history-card__title">{m.title}</div>
                        <div className="history-card__meta">
                          <span><MapPin size={11} /> {m.city}</span>
                          <span>💰 {m.pay}</span>
                          <span>📅 {m.date}</span>
                        </div>
                      </div>
                      <span className="history-card__status">✓ Complétée</span>
                    </div>
                    <div className="history-card__rating">
                      {STARS(m.rating)}
                      <span className="history-card__rating-label">Note reçue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score de fiabilité */}
            <div className="profil-section">
              <h2 className="profil-section__title">Score de fiabilité</h2>
              <div className="reliability-card">
                <div className="reliability-score">98<span>%</span></div>
                <div className="reliability-bars">
                  {[
                    { label: 'Ponctualité',   pct: 100 },
                    { label: 'Qualité travail', pct: 95 },
                    { label: 'Communication', pct: 98 },
                    { label: 'Retour employeurs', pct: 100 },
                  ].map(r => (
                    <div key={r.label} className="reliability-row">
                      <span className="reliability-label">{r.label}</span>
                      <div className="reliability-bar-wrap">
                        <div className="reliability-bar" style={{ width: r.pct + '%' }} />
                      </div>
                      <span className="reliability-pct">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
