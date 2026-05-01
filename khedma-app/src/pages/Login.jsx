import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Phone, ArrowRight, Briefcase, HardHat, ChevronLeft } from 'lucide-react'
import './Login.css'

const DEMO_OTP = '1234'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [step, setStep]     = useState('role')   // 'role' | 'phone' | 'otp' | 'name'
  const [role, setRole]     = useState(params.get('role') || '')
  const [phone, setPhone]   = useState('')
  const [otp, setOtp]       = useState(['', '', '', ''])
  const [name, setName]     = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const otpRefs = [useRef(), useRef(), useRef(), useRef()]

  // Auto-advance if role preset from URL
  useEffect(() => {
    if (params.get('role')) { setRole(params.get('role')); setStep('phone') }
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const handleRoleSelect = (r) => { setRole(r); setStep('phone') }

  const handlePhone = async (e) => {
    e.preventDefault(); setError('')
    if (phone.replace(/\D/g, '').length < 9) { setError('Numéro invalide'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900)) // simulate SMS send
    setLoading(false)
    setCountdown(60)
    setStep('otp')
  }

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 3) otpRefs[i + 1].current?.focus()
    if (next.every(d => d) && !next.join('').includes('')) {
      verifyOtp(next.join(''))
    }
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i - 1].current?.focus()
  }

  const verifyOtp = async (code) => {
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    if (code !== DEMO_OTP) {
      setError('Code incorrect. En démo, utilisez 1234'); setOtp(['','','',''])
      otpRefs[0].current?.focus(); return
    }
    setStep('name')
  }

  const handleName = (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Entrez votre nom'); return }
    login({ phone, role, name: name.trim() })
    navigate(role === 'employer' ? '/dashboard' : '/missions')
  }

  const resend = async () => {
    if (countdown > 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    setCountdown(60)
    setOtp(['','','',''])
    otpRefs[0].current?.focus()
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-blob login-blob--1" />
        <div className="login-blob login-blob--2" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <Link to="/" className="login-logo">
          <Briefcase size={18} strokeWidth={2.5} />
          K<span>H</span>EDMA
        </Link>

        {/* Back button */}
        {step !== 'role' && (
          <button className="login-back" onClick={() => {
            setError('')
            if (step === 'otp') { setStep('phone'); setOtp(['','','','']) }
            else if (step === 'phone') setStep('role')
            else if (step === 'name') setStep('otp')
          }}>
            <ChevronLeft size={16} /> Retour
          </button>
        )}

        {/* Progress dots */}
        <div className="login-progress">
          {['role','phone','otp','name'].map((s, i) => (
            <div key={s} className={`login-progress__dot ${['role','phone','otp','name'].indexOf(step) >= i ? 'active' : ''}`} />
          ))}
        </div>

        {/* ── STEP 1: ROLE ── */}
        {step === 'role' && (
          <div className="login-step">
            <h1 className="login-title">Bienvenue sur KHEDMA</h1>
            <p className="login-sub">Je suis ici pour…</p>
            <div className="role-grid">
              <button className="role-card" onClick={() => handleRoleSelect('worker')}>
                <div className="role-card__icon role-card__icon--worker">
                  <HardHat size={28} />
                </div>
                <div className="role-card__label">Trouver une mission</div>
                <div className="role-card__sub">CDD, intérim, job ponctuel</div>
              </button>
              <button className="role-card" onClick={() => handleRoleSelect('employer')}>
                <div className="role-card__icon role-card__icon--employer">
                  <Briefcase size={28} />
                </div>
                <div className="role-card__label">Recruter</div>
                <div className="role-card__sub">Poster une mission rapidement</div>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: PHONE ── */}
        {step === 'phone' && (
          <div className="login-step">
            <div className="login-role-badge">
              {role === 'worker' ? <HardHat size={14} /> : <Briefcase size={14} />}
              {role === 'worker' ? 'Travailleur' : 'Employeur'}
            </div>
            <h1 className="login-title">Votre numéro</h1>
            <p className="login-sub">Nous vous enverrons un code de confirmation par SMS</p>
            <form onSubmit={handlePhone} className="login-form">
              <div className="login-input-wrap">
                <span className="login-prefix"><Phone size={16} /> +213</span>
                <input
                  className="login-input"
                  type="tel" placeholder="6XX XX XX XX"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  maxLength={10} autoFocus
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="btn-primary login-submit" disabled={loading}>
                {loading ? <span className="login-spinner" /> : <>Envoyer le code <ArrowRight size={16} /></>}
              </button>
            </form>
            <p className="login-hint">Code demo : <strong>1234</strong></p>
          </div>
        )}

        {/* ── STEP 3: OTP ── */}
        {step === 'otp' && (
          <div className="login-step">
            <h1 className="login-title">Code de vérification</h1>
            <p className="login-sub">Entrez le code envoyé au <strong>{phone}</strong></p>
            <div className="otp-grid">
              {otp.map((d, i) => (
                <input
                  key={i} ref={otpRefs[i]}
                  className={`otp-input ${loading ? 'otp-input--loading' : ''}`}
                  type="text" inputMode="numeric"
                  maxLength={1} value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <div className="login-error">{error}</div>}
            {loading && <div className="login-verifying">Vérification…</div>}
            <button className="login-resend" onClick={resend} disabled={countdown > 0}>
              {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code'}
            </button>
            <p className="login-hint">Code demo : <strong>1234</strong></p>
          </div>
        )}

        {/* ── STEP 4: NAME ── */}
        {step === 'name' && (
          <div className="login-step">
            <div className="login-success-icon">✓</div>
            <h1 className="login-title">Numéro vérifié !</h1>
            <p className="login-sub">Une dernière étape — comment vous appelez-vous ?</p>
            <form onSubmit={handleName} className="login-form">
              <input
                className="login-input login-input--full"
                type="text" placeholder="Votre prénom et nom"
                value={name} onChange={e => setName(e.target.value)}
                autoFocus
              />
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="btn-primary login-submit">
                Accéder à KHEDMA <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
