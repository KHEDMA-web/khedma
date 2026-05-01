import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { generateContractPDF } from '../lib/contractPDF'
import { Download, CheckCircle, FileText, Shield } from 'lucide-react'
import './Contrat.css'

// Contrat demo
const DEMO_CONTRACT = {
  contractId: 'KHD-2026-00142',
  generatedAt: new Date().toLocaleDateString('fr-DZ', { day:'2-digit', month:'long', year:'numeric' }),
  startDate: '05/05/2026',
  endDate: '10/05/2026',
  pay: '3 500 DA / jour',
  city: 'Alger Centre',
  employer: { name: 'BatiAlg SARL', address: 'Zone Industrielle Rouiba, Alger', rc: '22B1001234' },
  worker: { name: 'Youcef Amrani', phone: '+213 6 55 XX XX XX', cni: '123456789' },
  mission: { title: 'Maçon Niveau 2', sector: 'BTP', duration: '5 jours' },
  employerSignedAt: '01/05/2026 09:14',
  workerSignedAt: null,
}

const DEMO_OTP = '1234'

export default function Contrat() {
  const { user } = useAuth()
  const [step, setStep]       = useState('review')   // review | otp | signed
  const [otp, setOtp]         = useState(['','','',''])
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl]   = useState(null)
  const [hash, setHash]       = useState('')
  const otpRefs               = [useRef(), useRef(), useRef(), useRef()]

  const contract = { ...DEMO_CONTRACT, worker: { ...DEMO_CONTRACT.worker, name: user?.name || 'Travailleur', phone: user?.phone || '+213 6XX XX XX XX' } }

  const handleOtpChange = async (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next)
    if (val && i < 3) otpRefs[i+1].current?.focus()
    if (next.every(d => d)) await verifyAndSign(next.join(''))
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i-1].current?.focus()
  }

  const verifyAndSign = async (code) => {
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (code !== DEMO_OTP) {
      setLoading(false); setError('Code incorrect. Démo : 1234')
      setOtp(['','','','']); otpRefs[0].current?.focus(); return
    }
    // Generate PDF
    const signedContract = {
      ...contract,
      workerSignedAt: new Date().toLocaleString('fr-DZ'),
    }
    const { blob, hash: h, dataUrl } = await generateContractPDF(signedContract)
    setHash(h); setPdfUrl(dataUrl); setLoading(false); setStep('signed')
  }

  const downloadPDF = () => {
    const a = document.createElement('a')
    a.href = pdfUrl; a.download = `Contrat_KHEDMA_${contract.contractId}.pdf`; a.click()
  }

  return (
    <div className="contrat-page">
      <div className="container contrat-inner">

        {/* Progress */}
        <div className="contrat-progress">
          {[
            { key:'review', label:'Révision' },
            { key:'otp',    label:'Signature OTP' },
            { key:'signed', label:'Signé' },
          ].map((s, i) => {
            const steps = ['review','otp','signed']
            const cur = steps.indexOf(step)
            const idx = steps.indexOf(s.key)
            return (
              <div key={s.key} className={`cp-step ${cur >= idx ? 'done' : ''} ${cur === idx ? 'active' : ''}`}>
                <div className="cp-dot">{cur > idx ? '✓' : i+1}</div>
                <span className="cp-label">{s.label}</span>
                {i < 2 && <div className={`cp-line ${cur > idx ? 'done' : ''}`} />}
              </div>
            )
          })}
        </div>

        {/* ── STEP 1: REVIEW ── */}
        {step === 'review' && (
          <div className="contrat-layout">
            <div className="contrat-doc">
              <div className="contrat-doc__header">
                <div className="contrat-doc__logo">KHEDMA</div>
                <div>
                  <div className="contrat-doc__num">N° {contract.contractId}</div>
                  <div className="contrat-doc__date">{contract.generatedAt}</div>
                </div>
              </div>
              <div className="contrat-doc__title">CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE</div>
              <div className="contrat-doc__law">Loi n°90-11 du 21 avril 1990 relative aux relations de travail</div>

              <div className="contrat-parties">
                <div className="contrat-party">
                  <div className="contrat-party__role">Employeur</div>
                  <div className="contrat-party__name">{contract.employer.name}</div>
                  <div className="contrat-party__detail">{contract.employer.address}</div>
                  <div className="contrat-party__detail">RC : {contract.employer.rc}</div>
                </div>
                <div className="contrat-party-sep">↔</div>
                <div className="contrat-party">
                  <div className="contrat-party__role">Travailleur</div>
                  <div className="contrat-party__name">{contract.worker.name}</div>
                  <div className="contrat-party__detail">{contract.worker.phone}</div>
                </div>
              </div>

              {[
                { title: 'Article 1 — Poste', content: `${contract.mission.title} · Secteur : ${contract.mission.sector} · Lieu : ${contract.city}` },
                { title: 'Article 2 — Durée', content: `Du ${contract.startDate} au ${contract.endDate} (${contract.mission.duration})` },
                { title: 'Article 3 — Rémunération', content: `${contract.pay} — Payable à la fin de la mission par l'employeur` },
                { title: 'Article 4 — Obligations', content: 'Respect des horaires, règles de sécurité et des modalités convenues. Paiement sous 24h après fin de mission.' },
                { title: 'Article 5 — Droit applicable', content: 'Législation algérienne du travail. Tout litige sera soumis au tribunal compétent du lieu d\'exécution.' },
              ].map(a => (
                <div key={a.title} className="contrat-article">
                  <div className="contrat-article__title">{a.title}</div>
                  <div className="contrat-article__body">{a.content}</div>
                </div>
              ))}

              <div className="contrat-sigs">
                <div className="contrat-sig contrat-sig--signed">
                  <div className="contrat-sig__role">Employeur</div>
                  <div className="contrat-sig__name">{contract.employer.name}</div>
                  <div className="contrat-sig__ts">✓ Signé le {contract.employerSignedAt}</div>
                </div>
                <div className="contrat-sig contrat-sig--pending">
                  <div className="contrat-sig__role">Travailleur</div>
                  <div className="contrat-sig__name">{contract.worker.name}</div>
                  <div className="contrat-sig__ts">⏳ En attente de votre signature</div>
                </div>
              </div>
            </div>

            <div className="contrat-sidebar">
              <div className="contrat-info-card">
                <FileText size={20} color="var(--green)" />
                <h3>Prêt à signer ?</h3>
                <p>Lisez attentivement le contrat. En signant, vous acceptez toutes les conditions ci-contre.</p>
                <div className="contrat-info-row"><span>Mission</span><strong>{contract.mission.title}</strong></div>
                <div className="contrat-info-row"><span>Durée</span><strong>{contract.mission.duration}</strong></div>
                <div className="contrat-info-row"><span>Salaire</span><strong>{contract.pay}</strong></div>
                <div className="contrat-info-row"><span>Lieu</span><strong>{contract.city}</strong></div>
              </div>
              <div className="contrat-security">
                <Shield size={16} color="var(--green)" />
                <span>Contrat sécurisé · Signature OTP · Archivage PDF</span>
              </div>
              <button className="btn-primary contrat-sign-btn" onClick={() => setStep('otp')}>
                Signer le contrat →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 'otp' && (
          <div className="contrat-otp-wrap">
            <div className="contrat-otp-card">
              <div className="contrat-otp-icon">🔐</div>
              <h2>Confirmez votre signature</h2>
              <p>Un code a été envoyé au <strong>{contract.worker.phone}</strong></p>
              <div className="otp-grid">
                {otp.map((d,i) => (
                  <input key={i} ref={otpRefs[i]}
                    className={`otp-input ${loading ? 'otp-input--loading' : ''}`}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error  && <div className="login-error">{error}</div>}
              {loading && <div className="contrat-verifying">Génération du contrat PDF…</div>}
              <p className="login-hint">Code démo : <strong>1234</strong></p>
              <button className="contrat-back" onClick={() => { setStep('review'); setOtp(['','','','']); setError('') }}>← Retour au contrat</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SIGNED ── */}
        {step === 'signed' && (
          <div className="contrat-success">
            <div className="contrat-success__icon">
              <CheckCircle size={48} color="var(--green)" strokeWidth={1.5} />
            </div>
            <h2>Contrat signé avec succès !</h2>
            <p>Votre contrat a été généré, signé numériquement et archivé.</p>
            <div className="contrat-hash-box">
              <div className="contrat-hash-label"><Shield size={14} /> Empreinte SHA-256 du document</div>
              <div className="contrat-hash-val">{hash}</div>
            </div>
            <div className="contrat-success-meta">
              <div className="contrat-info-row"><span>Mission</span><strong>{contract.mission.title}</strong></div>
              <div className="contrat-info-row"><span>Employeur</span><strong>{contract.employer.name}</strong></div>
              <div className="contrat-info-row"><span>Durée</span><strong>{contract.mission.duration}</strong></div>
              <div className="contrat-info-row"><span>Rémunération</span><strong>{contract.pay}</strong></div>
              <div className="contrat-info-row"><span>Signé le</span><strong>{new Date().toLocaleString('fr-DZ')}</strong></div>
            </div>
            <button className="btn-primary contrat-dl-btn" onClick={downloadPDF}>
              <Download size={18} /> Télécharger le PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
