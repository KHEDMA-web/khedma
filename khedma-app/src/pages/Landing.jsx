import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Bell, Smartphone, Users, TrendingUp, Award, Handshake } from 'lucide-react'
import './Landing.css'

const STATS = [
  { num: '2,5M', label: 'Chômeurs en Algérie' },
  { num: '70%',  label: 'Offres = CDD/intérim' },
  { num: '200+', label: 'Agences d\'intérim' },
  { num: '0',    label: 'Acteur structuré' },
]

const PROBLEMS = [
  { icon: '🔍', color: '#FF6B6B', title: 'Manque de centralisation', body: 'Les offres CDD & intérim sont éparpillées entre agences, sites généralistes et groupes Facebook. Impossible de tout surveiller.' },
  { icon: '🚫', color: '#FFD166', title: 'Opacité totale', body: 'Les travailleurs ignorent les conditions réelles des missions. Pas d\'avis vérifiés, pas de transparence sur les salaires.' },
  { icon: '⚡', color: '#00C896', title: 'Urgences non couvertes', body: 'Les entreprises peinent à recruter en moins de 72h pour des besoins ponctuels en BTP, événementiel, logistique.' },
]

const FEATURES = [
  { Icon: Zap,        color: '#00C896', title: 'Agrégation temps réel',     body: 'Collecte automatisée depuis toutes les agences et employeurs d\'Algérie.' },
  { Icon: Shield,     color: '#FFD166', title: 'Transparence totale',        body: 'Classement par date, avis vérifiés, zéro sponsoring caché.' },
  { Icon: Bell,       color: '#FF6B6B', title: 'Alertes géolocalisées',      body: 'Notifications push pour les missions urgentes près de vous.' },
  { Icon: Smartphone, color: '#74B9FF', title: 'Candidature en 1 clic',      body: 'CV simplifié, profil "Disponible maintenant", mobile-first.' },
]

const ADVANTAGES = [
  { Icon: Award,     title: '1ère plateforme dédiée',        body: 'Avantage de pionnier absolu — aucun acteur structuré sur ce segment.' },
  { Icon: TrendingUp,title: 'Matching IA temps réel',         body: 'Algorithme travailleur ↔ mission + système anti-arnaques intégré.' },
  { Icon: Users,     title: 'Impact social fort',             body: 'Réduction du chômage des jeunes et formalisation des contrats.' },
  { Icon: Handshake, title: 'Réseau 200+ agences partenaires',body: 'PME/TPE en BTP, restauration, logistique dès le lancement.' },
]

const FUNDS = [
  { label: 'Développement Tech & IA', pct: 50, color: '#00C896' },
  { label: 'Marketing ciblé',         pct: 30, color: '#74B9FF' },
  { label: 'Legal & Conformité',      pct: 15, color: '#FFD166' },
  { label: 'Frais opérationnels',     pct: 5,  color: '#FF6B6B' },
]

export default function Landing() {
  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__grid" />
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
        </div>
        <div className="container hero__content">
          <div className="hero__badge fade-up">
            <span className="tag-dot" />
            Startup Algérienne · Plateforme d'Emploi Temporaire
          </div>
          <h1 className="hero__title fade-up delay-1">
            L'emploi temporaire,<br />
            <span className="hero__accent">simplifié</span> &amp;{' '}
            <span className="hero__underline">transparent.</span>
          </h1>
          <p className="hero__sub fade-up delay-2">
            KHEDMA agrège toutes les missions CDD, intérim et jobs ponctuels d'Algérie
            en un seul endroit — matching temps réel, zéro opacité, candidature en 1 clic.
          </p>
          <div className="hero__actions fade-up delay-3">
            <Link to="/login" className="btn-primary">
              Je cherche une mission <ArrowRight size={16} />
            </Link>
            <Link to="/login?role=employer" className="btn-ghost">
              Je recrute
            </Link>
          </div>
          <div className="hero__stats fade-up delay-4">
            {STATS.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-num">{s.num}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section className="section landing__light" id="solution">
        <div className="container">
          <div className="tag"><span className="tag-dot" style={{ background: '#FF6B6B' }} />Le problème</div>
          <h2 className="section-title" style={{ color: 'var(--navy)' }}>
            3 défis bloquent l'emploi<br />temporaire en Algérie
          </h2>
          <p className="section-sub" style={{ color: '#4A5568' }}>
            Trouver ou proposer une mission courte reste un parcours du combattant des deux côtés.
          </p>
          <div className="grid-3" style={{ marginTop: 48 }}>
            {PROBLEMS.map(p => (
              <div key={p.title} className="prob-card">
                <div className="prob-card__accent" style={{ background: p.color }} />
                <div className="prob-card__icon" style={{ background: p.color + '22' }}>{p.icon}</div>
                <h3 className="prob-card__title">{p.title}</h3>
                <p className="prob-card__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="section" style={{ background: 'var(--navy2)' }}>
        <div className="container">
          <div className="tag"><span className="tag-dot" />Notre solution</div>
          <h2 className="section-title">Une plateforme qui<br />change tout</h2>
          <p className="section-sub">Web & mobile — pensée pour les travailleurs algériens et les employeurs qui ont besoin de rapidité.</p>
          <div className="solution__layout">
            <div className="solution__features">
              {FEATURES.map(({ Icon, color, title, body }) => (
                <div key={title} className="feature-item">
                  <div className="feature-item__icon" style={{ background: color + '22' }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <h4 className="feature-item__title">{title}</h4>
                    <p className="feature-item__body">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="phone-mock">
              <div className="phone-mock__frame">
                <div className="phone-mock__notch" />
                <div className="phone-mock__header">
                  <span className="phone-mock__app-name">KHEDMA</span>
                  <span className="phone-mock__badge">3 nouvelles</span>
                </div>
                {[
                  { co: '🏗 BatiAlg', tag: 'URGENT', title: 'Maçon — Alger Centre', loc: '2 km', pay: '3 500 DA/j', dur: '3 jours' },
                  { co: '🍽 RestoCorp', tag: 'CDD', title: 'Serveur — Oran', loc: '5 km', pay: '45 000 DA/m', dur: '1 mois' },
                  { co: '📦 LogisDZ', tag: 'INTÉRIM', title: 'Préparateur commandes', loc: '8 km', pay: '2 800 DA/j', dur: '1 semaine' },
                ].map(j => (
                  <div key={j.title} className="phone-mock__card">
                    <div className="phone-mock__card-top">
                      <span className="phone-mock__co">{j.co}</span>
                      <span className="phone-mock__tag">{j.tag}</span>
                    </div>
                    <div className="phone-mock__title">{j.title}</div>
                    <div className="phone-mock__pills">
                      <span>📍 {j.loc}</span><span>💰 {j.pay}</span><span>⏱ {j.dur}</span>
                    </div>
                  </div>
                ))}
                <div className="phone-mock__cta">Postuler en 1 clic →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARCHÉ ── */}
      <section className="section" id="marche">
        <div className="container">
          <div className="tag"><span className="tag-dot" />Le marché</div>
          <h2 className="section-title">Un marché massif<br />&amp; inexploité</h2>
          <p className="section-sub">Aucun acteur structuré n'existe sur ce segment en Algérie. KHEDMA est la première solution.</p>
          <div className="marche__grid">
            {[
              { num: '2,5M', desc: 'Chômeurs 16–35 ans cherchant de l\'emploi temporaire (ONS 2023)' },
              { num: '1,8M', desc: 'Étudiants actifs cherchant des jobs compatibles avec leurs études' },
              { num: '200+', desc: 'Agences d\'intérim sans plateforme unifiée pour diffuser leurs offres' },
              { num: '70%',  desc: 'Des offres d\'emploi algériennes concernent des CDD ou de l\'intérim (ANEM)' },
            ].map(s => (
              <div key={s.num} className="marche__stat">
                <div className="marche__num">{s.num}</div>
                <p className="marche__desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="marche__highlight">
            <span style={{ fontSize: 32 }}>📈</span>
            <div>
              <div className="marche__highlight-title">0 acteur structuré sur ce marché aujourd'hui</div>
              <div className="marche__highlight-sub">KHEDMA sera la référence nationale dès le lancement — avantage de pionnier absolu</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="section landing__light">
        <div className="container">
          <div className="tag"><span className="tag-dot" style={{ background: '#FFD166' }} />Avantage concurrentiel</div>
          <h2 className="section-title" style={{ color: 'var(--navy)' }}>Pourquoi KHEDMA<br />va s'imposer</h2>
          <div className="grid-2" style={{ marginTop: 48 }}>
            {ADVANTAGES.map(({ Icon, title, body }) => (
              <div key={title} className="adv-card">
                <div className="adv-card__icon"><Icon size={22} color="var(--green)" /></div>
                <h3 className="adv-card__title">{title}</h3>
                <p className="adv-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODÈLE ÉCONOMIQUE ── */}
      <section className="section" style={{ background: 'var(--navy2)' }} id="modele">
        <div className="container">
          <div className="tag"><span className="tag-dot" />Modèle économique</div>
          <h2 className="section-title">Rentable dès le<br />premier recrutement</h2>
          <div className="modele__grid">
            <div className="modele__rev">
              <div className="modele__pct">15–20%</div>
              <div className="modele__rev-label">Commission sur recrutement</div>
              <p className="modele__rev-body">Du salaire de la mission, facturée à l'employeur uniquement. Le travailleur accède gratuitement à toutes les offres.</p>
              <Link to="/login?role=employer" className="btn-primary" style={{ marginTop: 24 }}>
                Poster une mission <ArrowRight size={16} />
              </Link>
            </div>
            <div className="modele__funds">
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Utilisation des fonds levés</h4>
              {FUNDS.map(f => (
                <div key={f.label} className="fund-row">
                  <span className="fund-row__label">{f.label}</span>
                  <div className="fund-row__bar-wrap">
                    <div className="fund-row__bar" style={{ width: f.pct + '%', background: f.color }} />
                  </div>
                  <span className="fund-row__pct">{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="section landing__cta">
        <div className="container landing__cta-inner">
          <div className="tag" style={{ justifyContent: 'center' }}><span className="tag-dot" />Rejoindre l'aventure</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Investissez dans<br />l'emploi de demain.
          </h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 40px' }}>
            KHEDMA est la 1ère plateforme d'emploi temporaire en Algérie. Le marché est massif, la technologie est prête.
          </p>
          <div className="landing__cta-btns">
            <a href="https://yinvesti.dz" className="btn-primary" style={{ background: 'var(--navy)', color: 'var(--white)' }}>
              Investir sur Yinvesti <ArrowRight size={16} />
            </a>
            <Link to="/login" className="btn-primary">
              Tester l'application <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing__footer">
        <div className="container landing__footer-inner">
          <span className="navbar__logo" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, display:'flex', alignItems:'center', gap:6 }}>
            K<span style={{ color: 'var(--green)' }}>H</span>EDMA
          </span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            © 2026 KHEDMA · Alger, Algérie
          </span>
          <span className="badge badge-green">🇩🇿 Made in Algeria</span>
        </div>
      </footer>
    </div>
  )
}
