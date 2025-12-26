import { processInvoice } from "./engine"

const invoice1 = {
  invoiceNumber: "INV-A-001",
  vendor: "Supplier GmbH",
  fields: {
    Leistungsdatum: "2025-01-10",
    amount: 1000
  },
  rawText: "Leistungsdatum 10.01.2025"
}

console.log("\n--- RUN 1 (NO MEMORY) ---")
console.log(
  processInvoice(invoice1)
)

console.log("\n--- HUMAN CORRECTION APPLIED ---")
console.log(
  processInvoice(invoice1, {
    serviceDate: "Leistungsdatum"
  })
)

console.log("\n--- RUN 2 (WITH MEMORY) ---")
console.log(
  processInvoice(invoice1)
)
