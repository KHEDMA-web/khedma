import { useState } from 'react'
import { Plus, Users, Clock, CheckCircle, TrendingUp, Eye, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const POSTED = [
  { id:1, title:'Maçon Niveau 2',         type:'URGENT',  city:'Alger Centre', pay:'3 500 DA/j', dur:'5 jours',   apps:7,  status:'active',  posted:'Aujourd\'hui' },
  { id:2, title:'Agent de sécurité',      type:'CDD',     city:'Hydra',        pay:'40 000 DA/m',dur:'1 mois',    apps:3,  status:'active',  posted:'Hier' },
  { id:3, title:'Préparateur commandes',  type:'INTÉRIM', city:'Rouiba',       pay:'2 800 DA/j', dur:'1 semaine', apps:12, status:'closed',  posted:'Il y a 5 jours' },
]

const APPLICANTS = [
  { id:1, name:'Youcef Amrani',  job:'Maçon Niveau 2',        rating:4.8, missions:14, status:'nouveau',  avatar:'YA' },
  { id:2, name:'Karim Belaïd',   job:'Maçon Niveau 2',        rating:4.5, missions:8,  status:'nouveau',  avatar:'KB' },
  { id:3, name:'Samira Oukaci',  job:'Agent de sécurité',     rating:4.9, missions:22, status:'contacté', avatar:'SO' },
  { id:4, name:'Omar Hadj Ali',  job:'Maçon Niveau 2',        rating:4.2, missions:5,  status:'nouveau',  avatar:'OH' },
]

const STATUS_MAP = {
  active:  { label: 'Active',  color: '#00C896', bg: 'rgba(0,200,150,0.12)' },
  closed:  { label: 'Fermée', color: '#8BA3BE', bg: 'rgba(139,163,190,0.12)' },
  pending: { label: 'En attente', color: '#FFD166', bg: 'rgba(255,209,102,0.12)' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', sector:'', city:'', pay:'', dur:'', type:'CDD', desc:'' })
  const [posted, setPosted] = useState(POSTED)
  const [contacted, setContacted] = useState(new Set())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.city) return
    setPosted(p => [{
      id: Date.now(), title: form.title, type: form.type,
      city: form.city, pay: form.pay, dur: form.dur,
      apps: 0, status:'active', posted:'À l\'instant'
    }, ...p])
    setForm({ title:'', sector:'', city:'', pay:'', dur:'', type:'CDD', desc:'' })
    setShowForm(false)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="container">
          <div className="dashboard-hero__top">
            <div>
              <h1 className="dashboard-hero__title">Tableau de bord</h1>
              <p className="dashboard-hero__sub">{user?.name} · Employeur</p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Poster une mission
            </button>
          </div>
          {/* KPIs */}
          <div className="dashboard-kpis">
            {[
              { icon: <TrendingUp size={20} />, label:'Missions actives', val: posted.filter(p=>p.status==='active').length, color:'#00C896' },
              { icon: <Users size={20} />,      label:'Candidatures reçues', val: posted.reduce((a,p)=>a+p.apps,0) + APPLICANTS.length, color:'#74B9FF' },
              { icon: <Clock size={20} />,       label:'Temps moyen réponse', val: '< 2h', color:'#FFD166' },
              { icon: <CheckCircle size={20} />, label:'Missions complétées', val: posted.filter(p=>p.status==='closed').length, color:'#FF6B6B' },
            ].map(k => (
              <div key={k.label} className="kpi-card">
                <div className="kpi-card__icon" style={{ background: k.color + '22', color: k.color }}>{k.icon}</div>
                <div className="kpi-card__val">{k.val}</div>
                <div className="kpi-card__label">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container dashboard-body">
        <div className="dashboard-grid">
          {/* Posted missions */}
          <div>
            <h2 className="dashboard-section-title">Mes missions postées</h2>
            <div className="posted-list">
              {posted.map(m => {
                const st = STATUS_MAP[m.status]
                return (
                  <div key={m.id} className="posted-card">
                    <div className="posted-card__top">
                      <h3 className="posted-card__title">{m.title}</h3>
                      <span className="posted-card__status" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="posted-card__meta">
                      <span>📍 {m.city}</span>
                      <span>💰 {m.pay}</span>
                      <span>⏱ {m.dur}</span>
                      <span>📅 {m.posted}</span>
                    </div>
                    <div className="posted-card__footer">
                      <span className="posted-card__apps">
                        <Users size={14} /> {m.apps} candidature{m.apps !== 1 ? 's' : ''}
                      </span>
                      <button className="posted-card__view">
                        <Eye size={14} /> Voir les candidats
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Applicants */}
          <div>
            <h2 className="dashboard-section-title">Candidatures récentes</h2>
            <div className="applicants-list">
              {APPLICANTS.map(a => (
                <div key={a.id} className="applicant-card">
                  <div className="applicant-card__avatar">{a.avatar}</div>
                  <div className="applicant-card__info">
                    <div className="applicant-card__name">{a.name}</div>
                    <div className="applicant-card__job">{a.job}</div>
                    <div className="applicant-card__stats">
                      ⭐ {a.rating} · {a.missions} missions complétées
                    </div>
                  </div>
                  <div className="applicant-card__right">
                    {contacted.has(a.id) ? (
                      <span className="applicant-contacted">✓ Contacté</span>
                    ) : (
                      <button
                        className="btn-primary applicant-card__btn"
                        onClick={() => setContacted(s => new Set(s).add(a.id))}
                      >
                        <MessageCircle size={14} /> Contacter
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post mission modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__title">Poster une mission</h2>
              <button className="modal__close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="mission-form">
              <div className="form-row">
                <label>Intitulé du poste *</label>
                <input placeholder="Ex: Maçon Niveau 2, Serveur, Agent logistique…" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required />
              </div>
              <div className="form-row-2">
                <div className="form-row">
                  <label>Type de contrat</label>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                    <option>CDD</option><option>INTÉRIM</option><option>URGENT</option><option>JOURNALIER</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Ville *</label>
                  <input placeholder="Alger, Oran, Constantine…" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} required />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-row">
                  <label>Rémunération</label>
                  <input placeholder="3 500 DA/j ou 45 000 DA/m" value={form.pay} onChange={e=>setForm(f=>({...f,pay:e.target.value}))} />
                </div>
                <div className="form-row">
                  <label>Durée</label>
                  <input placeholder="5 jours, 1 mois…" value={form.dur} onChange={e=>setForm(f=>({...f,dur:e.target.value}))} />
                </div>
              </div>
              <div className="form-row">
                <label>Description (optionnel)</label>
                <textarea placeholder="Décrivez la mission, les compétences requises…" rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Publier la mission</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
