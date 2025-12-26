import * as fs from "fs"

const MEMORY_FILE = "memory.json"

type VendorMemory = {
  vendor: string
  sourceField: string
  targetField: string
  confidence: number
}

function loadMemory(): VendorMemory[] {
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify([]))
  }
  return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"))
}

function saveMemory(memory: VendorMemory[]) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2))
}

export function recallVendorMemory(vendor: string): VendorMemory[] {
  return loadMemory().filter(m => m.vendor === vendor)
}

export function learnVendorMemory(
  vendor: string,
  sourceField: string,
  targetField: string,
  approved: boolean
) {
  const memory = loadMemory()
  const existing = memory.find(
    m => m.vendor === vendor && m.sourceField === sourceField
  )

  if (existing) {
    existing.confidence = approved
      ? Math.min(existing.confidence + 0.1, 1)
      : Math.max(existing.confidence - 0.2, 0)
  } else if (approved) {
    memory.push({
      vendor,
      sourceField,
      targetField,
      confidence: 0.6
    })
  }

  saveMemory(memory)
}



type DuplicateRecord = {
  vendor: string
  invoiceNumber: string
}

const DUP_FILE = "duplicates.json"

function loadDuplicates(): DuplicateRecord[] {
  if (!fs.existsSync(DUP_FILE)) {
    fs.writeFileSync(DUP_FILE, JSON.stringify([]))
  }
  return JSON.parse(fs.readFileSync(DUP_FILE, "utf-8"))
}

function saveDuplicates(data: DuplicateRecord[]) {
  fs.writeFileSync(DUP_FILE, JSON.stringify(data, null, 2))
}

export function isDuplicate(vendor: string, invoiceNumber: string): boolean {
  const duplicates = loadDuplicates()
  return duplicates.some(
    d => d.vendor === vendor && d.invoiceNumber === invoiceNumber
  )
}

export function markDuplicate(vendor: string, invoiceNumber: string) {
  const duplicates = loadDuplicates()
  duplicates.push({ vendor, invoiceNumber })
  saveDuplicates(duplicates)
}
