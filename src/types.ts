export interface Invoice {
  invoiceNumber: string
  vendor: string
  fields: Record<string, any>
  rawText: string
}

export interface Output {
  normalizedInvoice: Record<string, any>
  proposedCorrections: string[]
  requiresHumanReview: boolean
  reasoning: string
  confidenceScore: number
  memoryUpdates: string[]
  auditTrail: {
    step: "recall" | "apply" | "decide" | "learn"
    timestamp: string
    details: string
  }[]
}
