import { Invoice, Output } from "./types"
import { recallVendorMemory, learnVendorMemory } from "./memory"
import { isDuplicate, markDuplicate } from "./memory"


export function processInvoice(
  invoice: Invoice,
  humanCorrection?: Record<string, string>
): Output {

  const auditTrail: Output["auditTrail"] = []
  const normalized = { ...invoice.fields }
  const proposedCorrections: string[] = []
  const memoryUpdates: string[] = []

  if (isDuplicate(invoice.vendor, invoice.fields.invoiceNumber)) {
  return {
    normalizedInvoice: invoice.fields,
    proposedCorrections: [],
    requiresHumanReview: true,
    reasoning: "Duplicate invoice detected for same vendor and invoice number",
    confidenceScore: 0,
    memoryUpdates: [],
    auditTrail: [
      {
        step: "decide",
        timestamp: new Date().toISOString(),
        details: "Invoice flagged as duplicate"
      }
    ]
  }
}
  // RECALL
  const memories = recallVendorMemory(invoice.vendor)
  auditTrail.push({
    step: "recall",
    timestamp: new Date().toISOString(),
    details: `Recalled ${memories.length} vendor memories`
  })

  let confidenceScore = 0

  // APPLY
  for (const mem of memories) {
    if (
      invoice.fields[mem.sourceField] &&
      !normalized[mem.targetField] &&
      mem.confidence >= 0.5
    ) {
      normalized[mem.targetField] = invoice.fields[mem.sourceField]
      proposedCorrections.push(
        `Mapped ${mem.sourceField} → ${mem.targetField}`
      )
      confidenceScore += mem.confidence
    }
  }

  auditTrail.push({
    step: "apply",
    timestamp: new Date().toISOString(),
    details: proposedCorrections.join("; ") || "No memory applied"
  })

  // DECIDE
  const requiresHumanReview = confidenceScore < 0.85

  auditTrail.push({
    step: "decide",
    timestamp: new Date().toISOString(),
    details: requiresHumanReview
      ? "Confidence too low, escalate"
      : "Auto-accepted"
  })

  // LEARN
  if (humanCorrection) {
    for (const [target, source] of Object.entries(humanCorrection)) {
      learnVendorMemory(invoice.vendor, source, target, true)
      memoryUpdates.push(`Learned ${source} → ${target}`)
    }

    auditTrail.push({
      step: "learn",
      timestamp: new Date().toISOString(),
      details: "Human correction stored"
    })
  }

  return {
    normalizedInvoice: normalized,
    proposedCorrections,
    requiresHumanReview,
    reasoning: "Decision based on vendor memory confidence",
    confidenceScore: Math.min(confidenceScore, 1),
    memoryUpdates,
    auditTrail
  }
}
