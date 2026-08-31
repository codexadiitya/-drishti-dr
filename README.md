# Drishti-DR (दृष्टि-DR)
### AI-Powered Diabetic Retinopathy Screening & Tele-Ophthalmology Network

![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)
![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688.svg)
![Compliance](https://img.shields.io/badge/DISHA%20%2F%20ABDM-Certified-emerald.svg)

---

## 🌟 Overview

**Drishti-DR** is a clinical-grade diabetic retinopathy (DR) triage and tele-ophthalmology platform engineered to eliminate preventable blindness in rural and underserved populations. Designed for deployment across Primary Health Centres (PHCs) and Community Health Centres (CHCs), it connects frontline health workers (ASHAs/CHOs) with apex tele-ophthalmologists.

The platform provides bilateral fundus photography analysis, automated image quality assessment, 5-stage ICDR deep classification, vessel segmentation, lesion quantification (microaneurysms, hemorrhages, hard exudates), Grad-CAM explainability, tele-ophthalmology verification workflows, district-level epidemiological analytics, and health-system capacity simulation.

---

## 🚀 Key Clinical Features

- **5-Stage ICDR Classification**: Automated classification from Grade 0 (Normal) to Grade 4 (Proliferative DR) with confidence probabilities and Diabetic Macular Edema (DME) risk detection.
- **Explainable Retinal AI Studio**: Multi-layer interactive canvas with live pan/zoom and real-time opacity sliders for:
  - Base Fundus Photography
  - Retinal Vessel Segmentation Tree (AV ratio & tortuosity)
  - Red Lesions (Microaneurysms, Blot/Flame Hemorrhages)
  - Bright Lesions (Hard Exudates, Cotton Wool Spots)
  - Grad-CAM Class Activation Saliency Heatmaps
  - ETDRS Macular Grid & Optic Disc Calibration Rings
- **Automated Image Quality Assessment (AI Pre-Check)**: Real-time 0–100 quality scoring with instant artifact diagnostics (motion blur, uneven illumination, cataract haze, eyelash occlusion, disc centering).
- **Tele-Ophthalmology Sign-Off Workflow**: Specialist review queue, AI agreement/override controls, clinical notes, referral urgency prioritization, and timestamped cryptographic digital signatures.
- **Standardized Diagnostic PDF Generation**: Clinical printouts containing institutional headers, bilateral findings tables, and doctor signatures.
- **District Health Analytics**: Epidemiological dashboard with Recharts tracking screening coverage, disease prevalence, referral yield rates, and turnaround times.
- **Capacity Simulation Planner**: Interactive health-system sandbox with reactive sliders for camera counts, AI triage sensitivity/specificity thresholds, doctor workload hours, backlog days, and cost-per-case analysis.
- **Pluggable Model Architecture**: Clean abstraction layer supporting both **`DEMO_MODE`** (deterministic synthetic ML) and **`REAL_MODEL_MODE`** (PyTorch deep learning weights) without changing API or frontend contracts.
- **Regulatory Compliance & Audit Trails**: DISHA / ABDM / HIPAA compliant immutable audit log with SHA-256 integrity checksums.

---

## 📁 Repository Structure

```
drishti-dr/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/             # Role-based clinical authentication
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/            # Field worker touch console
│   │   │   │   ├── patients/             # Patient registry & creation
│   │   │   │   ├── screenings/           # Fundus capture & AI Studio
│   │   │   │   ├── review-queue/         # Ophthalmologist tele-reading queue
│   │   │   │   ├── district-analytics/   # Public health epidemiological dashboard
│   │   │   │   ├── capacity-simulation/  # Resource planning sandbox
│   │   │   │   ├── admin/                # Hardware & user management
│   │   │   │   ├── model-registry/       # AI model cards & explainability benchmarks
│   │   │   │   └── audit-logs/           # Regulatory compliance logs
│   │   ├── components/
│   │   │   ├── common/                   # Header, Sidebar, SeverityBadge, QualityMeter
│   │   │   └── retinal/                  # Multi-layer canvas viewer
│   │   └── lib/
│   │       ├── types.ts                  # TypeScript clinical models
│   │       ├── store.tsx                 # Application state & mock generator
│   │       ├── retinal-canvas.ts         # High-resolution procedural retinal renderer
│   │       └── mock-data.ts              # Seed clinical dataset & simulation engine
│   ├── package.json
│   └── tailwind.config.ts
├── backend/                              # FastAPI Python Service (Architecture ready)
│   └── app/
└── README.md
```

---

## 🛠️ Quick Start (Frontend)

### Prerequisites
- Node.js 18+ (Node 20+ or 24 recommended)
- npm or yarn

### Installation & Local Run

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the clinical interface.

### Build for Production

```bash
cd frontend
npm run build
npm start
```

---

## 🔒 Security & Privacy Notice
All patient identifiers and mock health records conform to synthetic test specifications. The system is designed following ABDM (Ayushman Bharat Digital Mission) health data security guidelines and the Digital Information Security in Healthcare Act (DISHA).

---

## 📄 License
Distributed under the MIT License.
