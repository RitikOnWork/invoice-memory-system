# 🧠 Memory-Driven Invoice Learning System  
### AI Agent Intern Assignment – Flowbit AI

This project implements a **memory-driven learning layer** on top of invoice extraction systems.  
Instead of treating every invoice as a new case, the system **learns from past human corrections and vendor-specific patterns** and applies those learnings to future invoices.

> ⚠️ Note: OCR and extraction accuracy are **out of scope**.  
> All invoice data is assumed to be already extracted.

---

## 🎯 Problem Statement

Companies process hundreds of invoices daily.  
Many corrections repeat over time, such as:
- Vendor-specific field labels  
- VAT-inclusive pricing  
- Missing service dates  
- Duplicate invoices  
- Freight and Skonto patterns  

Traditional systems **do not learn** from these corrections.  
This results in wasted human effort and low automation rates.

---

## ✅ Solution Overview

This system introduces a **memory layer** that:

- Stores reusable insights from past invoices  
- Applies learned patterns to new invoices  
- Adjusts decisions based on confidence  
- Remains fully explainable and auditable  
- Persists memory across runs  

No ML model training is used — learning is **heuristic-based**, transparent, and safe.

---

Invoice Input
↓
Memory Recall
↓
Apply Learned Patterns
↓
Decision Engine
↓
Human Review (if required)
↓
Learning & Confidence Update
↓
Persistent Memory Store


---

## 🧠 Memory Types Implemented

### 1️⃣ Vendor Memory  
Learns vendor-specific recurring patterns.

**Examples**
- Supplier GmbH → `Leistungsdatum` = `serviceDate`
- Parts AG → Prices include VAT
- Freight & Co → “Seefracht / Shipping” → `FREIGHT` SKU

---

### 2️⃣ Correction Memory  
Learns from repeated human corrections.

**Examples**
- Missing serviceDate → extract from rawText  
- VAT included → recompute tax and gross  

---

### 3️⃣ Resolution Memory  
Tracks how suggestions were resolved:
- Approved → confidence increases  
- Rejected → confidence decreases  

This prevents bad or incorrect memory from dominating.

---

## ⚙️ Decision Logic

The system **never blindly auto-applies memory**.

| Confidence Score | Action |
|-----------------|--------|
| ≥ 0.85 | Auto-accept |
| 0.50 – 0.85 | Suggest correction |
| < 0.50 | Escalate for human review |

Each decision includes:
- Reasoning
- Confidence score
- Full audit trail

---

## 📦 Tech Stack

| Component | Choice |
|--------|------|
| Language | TypeScript (strict mode) |
| Runtime | Node.js |
| Persistence | File-based JSON memory |
| Learning | Heuristic-based (no ML training) |

📌 File-based persistence was chosen for **cross-platform stability** while still fulfilling the requirement of persistent memory.

---

## 📁 Project Structure

invoice-memory-system/
│
├── data/
│ ├── invoices_extracted.json
│ ├── purchase_orders.json
│ ├── delivery_notes.json
│ └── human_corrections.json
│
├── src/
│ ├── index.ts # Demo runner
│ ├── engine.ts # Core decision logic
│ ├── memory.ts # Persistent memory layer
│ ├── dataLoader.ts # JSON loader
│ └── types.ts
│
├── memory.json # Auto-generated learned memory
├── package.json
└── tsconfig.json


---

## ▶️ How to Run Locally

### 1️⃣ Install Dependencies
```bash
npm install
npm start
```

## Sample Output

{
  "normalizedInvoice": {},
  "proposedCorrections": [],
  "requiresHumanReview": true,
  "reasoning": "",
  "confidenceScore": 0.0,
  "memoryUpdates": [],
  "auditTrail": [
    {
      "step": "recall | apply | decide | learn",
      "timestamp": "",
      "details": ""
    }
  ]
}


## 🏗️ System Architecture

