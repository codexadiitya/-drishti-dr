# NetraRakshaq – Explainable AI for Diabetic Retinopathy Screening

NetraRakshaq is an AI-assisted diabetic retinopathy screening and triage platform designed for underserved and rural communities.

## Features
- **Retinal Image Quality Assessment:** Automatic check for focus, illumination, and field-of-view adequacy.
- **Explainable Multi-Stage AI Pipeline:**
  - CLAHE contrast enhancement
  - Retinal vessel segmentation
  - Optic disc & macula localization
  - Diabetic Retinopathy severity grading (No DR, Mild, Moderate, Severe, Proliferative DR)
  - Heatmap/feature explainability for clinical confidence
- **Clinical Review & Triage Queue:** Review flagged patients, referral urgency, and specialist escalation.
- **Rural Telemedicine & Capacity Planning:** District-level resource planning, screening camp workload forecasting, and follow-up reminders.

## Tech Stack
- **Framework:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS
- **Icons & Charts:** Lucide React, Recharts

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

The application will be available at `http://localhost:8443` (or the port specified by `PORT`).

### Build for Production
```bash
npm run build
```
