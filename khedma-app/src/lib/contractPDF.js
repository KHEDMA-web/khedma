// ─────────────────────────────────────────────────────────
// KHEDMA — Générateur de contrat PDF
// Utilise jsPDF pour créer un contrat conforme au droit algérien
// ─────────────────────────────────────────────────────────
import { jsPDF } from 'jspdf'

/**
 * Génère un SHA-256 du contenu du contrat
 */
export async function hashContract(content) {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Génère le PDF du contrat et retourne un Blob + hash
 */
export async function generateContractPDF(contract) {
  const {
    employer, worker, mission,
    startDate, endDate, pay, city,
    contractId, generatedAt
  } = contract

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, margin = 20, lineH = 7
  let y = margin

  const line  = (text, x = margin, size = 11, style = 'normal', color = [30,30,30]) => {
    doc.setFontSize(size); doc.setFont('helvetica', style); doc.setTextColor(...color)
    doc.text(text, x, y); y += lineH
  }
  const gap   = (n = 1) => { y += lineH * n }
  const hline = (col = [220,220,220]) => {
    doc.setDrawColor(...col); doc.line(margin, y, W - margin, y); y += 4
  }
  const box   = (x, bY, w, h, fill = [248,250,248]) => {
    doc.setFillColor(...fill); doc.roundedRect(x, bY, w, h, 3, 3, 'F')
  }

  // ── EN-TÊTE ──
  doc.setFillColor(10, 22, 40)
  doc.rect(0, 0, W, 38, 'F')
  doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 200, 150)
  doc.text('KHEDMA', margin, 18)
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(139, 163, 190)
  doc.text('Plateforme d\'emploi temporaire · khedma.dz', margin, 26)
  doc.setFontSize(9); doc.setTextColor(100, 130, 160)
  doc.text(`Contrat N° ${contractId}`, W - margin - 40, 18)
  doc.text(`Généré le ${generatedAt}`, W - margin - 40, 25)
  y = 50

  // ── TITRE ──
  doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(10, 22, 40)
  doc.text('CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE', W / 2, y, { align: 'center' })
  y += 6
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100)
  doc.text('Conformément à la loi n°90-11 du 21 avril 1990 relative aux relations de travail', W / 2, y, { align: 'center' })
  y += 12
  hline([0, 200, 150])

  // ── PARTIES ──
  gap(0.5)
  line('ENTRE LES SOUSSIGNÉS', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)

  // Employeur
  box(margin, y, (W - margin * 2) / 2 - 4, 32, [240, 248, 245])
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 158, 120)
  doc.text('EMPLOYEUR', margin + 4, y + 7)
  doc.setFont('helvetica', 'bold'); doc.setTextColor(10, 22, 40); doc.setFontSize(11)
  doc.text(employer.name, margin + 4, y + 14)
  doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80); doc.setFontSize(9)
  doc.text(employer.address || city, margin + 4, y + 20)
  doc.text(`RC : ${employer.rc || 'À compléter'}`, margin + 4, y + 26)

  // Travailleur
  const rx = W / 2 + 2
  box(rx, y, (W - margin * 2) / 2 - 4, 32, [240, 248, 245])
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 158, 120)
  doc.text('TRAVAILLEUR', rx + 4, y + 7)
  doc.setFont('helvetica', 'bold'); doc.setTextColor(10, 22, 40); doc.setFontSize(11)
  doc.text(worker.name, rx + 4, y + 14)
  doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80); doc.setFontSize(9)
  doc.text(`Tél : ${worker.phone}`, rx + 4, y + 20)
  doc.text(`CNI : ${worker.cni || 'À compléter'}`, rx + 4, y + 26)

  y += 38; hline()

  // ── MISSION ──
  line('ARTICLE 1 — OBJET DU CONTRAT', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)
  const missionText = [
    `L'employeur engage le travailleur pour le poste de : ${mission.title}`,
    `Secteur d'activité : ${mission.sector || 'Non spécifié'}`,
    `Lieu d'exécution : ${city}`,
  ]
  missionText.forEach(t => { line(t, margin + 4, 10, 'normal', [60, 60, 60]) })
  gap()

  // ── DURÉE ──
  line('ARTICLE 2 — DURÉE DU CONTRAT', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)
  line(`Date de début : ${startDate}`, margin + 4, 10, 'normal', [60, 60, 60])
  line(`Date de fin   : ${endDate}`, margin + 4, 10, 'normal', [60, 60, 60])
  line(`Durée totale  : ${mission.duration || 'Selon mission'}`, margin + 4, 10, 'normal', [60, 60, 60])
  gap()

  // ── RÉMUNÉRATION ──
  line('ARTICLE 3 — RÉMUNÉRATION', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)
  box(margin, y, W - margin * 2, 14, [255, 248, 225])
  doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(10, 22, 40)
  doc.text(pay || mission.pay, margin + 4, y + 10)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100)
  doc.text('Payable à la fin de la mission · Payé par l\'employeur exclusivement', W - margin - 4, y + 10, { align: 'right' })
  y += 20; gap()

  // ── OBLIGATIONS ──
  line('ARTICLE 4 — OBLIGATIONS DES PARTIES', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)
  const obligations = [
    'Le travailleur s\'engage à respecter les horaires et les règles de sécurité du lieu de travail.',
    'L\'employeur s\'engage à payer la rémunération dans les 24h suivant la fin de la mission.',
    'Toute modification des conditions doit faire l\'objet d\'un avenant écrit signé des deux parties.',
    'Le contrat peut être résilié par accord mutuel ou en cas de force majeure dûment constatée.',
  ]
  obligations.forEach(o => {
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60)
    const lines = doc.splitTextToSize(`• ${o}`, W - margin * 2 - 8)
    doc.text(lines, margin + 4, y)
    y += lines.length * 5 + 2
  })
  gap()

  // ── JURIDICTION ──
  line('ARTICLE 5 — DROIT APPLICABLE', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60)
  const juridText = doc.splitTextToSize(
    'Tout litige relatif à l\'exécution ou à l\'interprétation du présent contrat sera réglé à l\'amiable. ' +
    'À défaut, les parties conviennent de soumettre le différend au tribunal compétent du lieu d\'exécution de la mission, ' +
    'conformément à la législation algérienne en vigueur.',
    W - margin * 2 - 8
  )
  doc.text(juridText, margin + 4, y)
  y += juridText.length * 5 + 8
  hline()

  // ── SIGNATURES ──
  line('SIGNATURES', margin, 12, 'bold', [10, 22, 40])
  gap(0.5)
  const sigW = (W - margin * 2 - 8) / 2
  const sigY = y

  // Employeur
  box(margin, sigY, sigW, 36, [245, 250, 248])
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 158, 120)
  doc.text('Employeur', margin + 4, sigY + 8)
  doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60)
  doc.text(employer.name, margin + 4, sigY + 15)
  doc.text('Signé via KHEDMA', margin + 4, sigY + 22)
  doc.setTextColor(0, 158, 120)
  doc.text(contract.employerSignedAt || '— En attente —', margin + 4, sigY + 30)

  // Travailleur
  box(margin + sigW + 8, sigY, sigW, 36, [245, 250, 248])
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 158, 120)
  doc.text('Travailleur', margin + sigW + 12, sigY + 8)
  doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60)
  doc.text(worker.name, margin + sigW + 12, sigY + 15)
  doc.text('Signé via KHEDMA OTP', margin + sigW + 12, sigY + 22)
  doc.setTextColor(0, 158, 120)
  doc.text(contract.workerSignedAt || '— En attente —', margin + sigW + 12, sigY + 30)

  y = sigY + 42

  // ── HASH & FOOTER ──
  const contentForHash = `${contractId}-${employer.name}-${worker.name}-${mission.title}-${startDate}-${endDate}-${pay}`
  const hash = await hashContract(contentForHash)

  doc.setFillColor(15, 30, 55)
  doc.rect(0, y + 4, W, 28, 'F')
  doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 130, 160)
  doc.text('Intégrité du document — SHA-256 :', margin, y + 12)
  doc.setTextColor(0, 200, 150); doc.setFont('helvetica', 'bold'); doc.setFontSize(7)
  doc.text(hash, margin, y + 19)
  doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 100, 130); doc.setFontSize(8)
  doc.text(`KHEDMA · khedma.dz · ${generatedAt} · Ce document a valeur contractuelle`, W / 2, y + 26, { align: 'center' })

  // Retourne blob + hash
  const blob = doc.output('blob')
  return { blob, hash, dataUrl: doc.output('datauristring') }
}
