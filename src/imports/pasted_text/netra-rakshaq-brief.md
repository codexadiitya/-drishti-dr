Build a highly polished, modern, responsive web application called **NetraRakshaq**.

NetraRakshaq is an **Explainable AI system for Diabetic Retinopathy Screening in Rural India**. This is a hackathon/engineering prototype intended to demonstrate a complete screening workflow from retinal image acquisition to AI-assisted analysis, explainability, clinical review, referral, and large-scale telemedicine resource planning.

Before designing, **research the web for 2025–2026 real-world examples of:**

* Diabetic retinopathy screening platforms
* Retinal/fundus image analysis interfaces
* Ophthalmology and telemedicine dashboards
* Clinical AI dashboards
* Explainable AI interfaces for medical imaging
* Fundus-image visualization interfaces
* Rural healthcare / low-bandwidth telemedicine UX
* Medical image review workflows
* Modern clinical SaaS dashboards

Use this research to establish professional UX patterns, information hierarchy, terminology, and interaction patterns. Do NOT copy any company's design. Use the research only as inspiration.

IMPORTANT:
This should look like a **serious clinical AI product**, not a generic healthcare website, generic AI landing page, student portfolio, or template dashboard.

## 1. PRODUCT IDENTITY

Product name:
**NetraRakshaq**

Tagline:
**Explainable AI for Diabetic Retinopathy Screening**

Supporting message:
**Bringing accessible, explainable retinal screening to underserved and rural communities.**

Visual personality:

* Clinical
* Trustworthy
* Advanced
* Calm
* Precise
* Human-centered
* Research-driven
* Premium medical technology

Avoid:

* Cartoonish healthcare illustrations
* Excessive gradients
* Generic doctor stock photos
* Overly bright hospital-blue UI
* Excessive glassmorphism
* Cryptocurrency/Web3 aesthetics
* Gaming-style dashboards
* Excessive animations
* Fake medical claims

Use a sophisticated visual system with:

* Deep navy / charcoal foundation
* Clean white or very-light clinical surfaces
* Subtle cyan/teal accents
* Restrained green for positive/healthy states
* Amber for warnings
* Red only for clinically significant alerts
* Excellent contrast and accessibility

Typography should feel modern and professional. Prefer a clean sans-serif such as Inter, Geist, Manrope, or an equivalent available font.

Use a consistent 8px spacing system, strong grid alignment, generous whitespace, subtle borders, restrained shadows, rounded cards, and excellent visual hierarchy.

## 2. THIS IS AN APPLICATION, NOT JUST A LANDING PAGE

Create a complete interactive prototype with multiple screens/routes.

Primary navigation:

1. Overview
2. New Screening
3. Screening Queue
4. Patient Results
5. Explainability
6. Reports
7. Simulation
8. System / Settings

Desktop should be the primary experience because this is a clinical workstation/dashboard.

Also make the design responsive for tablet/mobile, but prioritize desktop/full-screen clinical workflows.

## 3. MAIN DASHBOARD — OVERVIEW

Create a highly polished clinical command center.

Header:

* NetraRakshaq logo
* Product name
* Environment/status indicator: "Prototype • AI-assisted screening"
* Search
* Notifications
* User profile

Sidebar navigation with elegant icons.

Main dashboard:

Hero/status area:
"Good evening, Dr. Sharma"
"AI-assisted retinal screening overview"

Show today's operational summary.

KPI cards:

* Patients screened today
* Images requiring recapture
* Referable DR cases
* Pending clinical reviews

Add a screening activity chart showing:

* Images screened over time
* Referable cases
* Recapture rate

Add a "Screening Queue" section:
Columns:

* Patient ID
* Image Quality
* DR Level
* Confidence
* Review Status
* Time
* Action

Add a "System Health" card:

* Image processing
* Segmentation
* Lesion detection
* DR classification
* Explainability
* API/system status

Add a compact "Deployment Capacity" card showing:

* Daily capacity
* Current utilization
* Estimated annual capacity
* Current bottleneck

The dashboard should immediately communicate:
**How many patients were screened, how many need attention, how reliable the current results appear, and whether the screening infrastructure is keeping up.**

## 4. NEW SCREENING PAGE

Create a professional retinal image acquisition workflow.

Layout:

LEFT:
Large drag-and-drop/upload area for a fundus image.

Include:
"Upload Fundus Image"

Supported-format hint.

Show a camera/acquisition option visually, but it can remain prototype functionality.

RIGHT:
"Image Quality Assessment"

Display three quality indicators:

* Focus
* Illumination
* Field of View

Example:
Focus — 94%
Illumination — 88%
Field of View — 92%

Overall:
"Image quality acceptable"
"Gradable"

Use a circular or horizontal quality visualization.

Below:
"Processing Pipeline"

Steps:

1. Image Quality
2. Enhancement
3. Retinal Structures
4. Lesion Detection
5. DR Classification
6. Explainability
7. Clinical Review

Show each stage changing from:
Pending → Processing → Complete

Include a clear "Start Analysis" CTA.

IMPORTANT:
The UI must support both:

* Original image
* Enhanced image

The original image must never disappear.

## 5. IMAGE QUALITY / RECAPTURE EXPERIENCE

Design a dedicated state for an ungradable image.

Example:

"Image quality insufficient"

Reasons:

* Focus too low
* Poor illumination
* Insufficient field of view

Show actionable feedback:

"Recapture recommended"
"Hold the camera steady and improve retinal illumination."

Use a calm warning design, not an alarming emergency design.

Include:

* Original image
* Quality scores
* Problem indicators
* Recapture button
* Continue only if quality is acceptable

This represents P4's Image Quality Assessment module.

## 6. PATIENT RESULT PAGE — MOST IMPORTANT SCREEN

Design the flagship clinical result interface.

Header:

"Patient PT-10021"

Status:
"AI Analysis Complete"

Show a large fundus image as the visual centerpiece.

Create an interactive image viewer with controls:

* Original
* Enhanced
* Vessel Overlay
* Lesion Overlay
* Grad-CAM
* Combined Evidence

Allow the clinician to switch between these views.

Beside/below the image show:

### DR Assessment

"Moderate Non-Proliferative Diabetic Retinopathy"

DR Level:
**2 / 4**

Confidence:
**93.1%**

Referable:
**YES**

Use a clear clinical status indicator.

Then show the five-stage scale:

Level 0 — No DR
Level 1 — Mild NPDR
Level 2 — Moderate NPDR
Level 3 — Severe NPDR
Level 4 — Proliferative DR

Highlight Level 2.

## 7. LESION EVIDENCE PANEL

Create a sophisticated evidence panel.

Show:

Microaneurysms

* Detected
* Count: 14
* Confidence: 91%

Hemorrhages

* Detected
* Count: 6
* Confidence: 87%

Exudates

* Detected
* Count: 3
* Confidence: 90%

Neovascularization

* Not detected
* Confidence: 88%

Each lesion should have:

* Detection status
* Count where applicable
* Confidence
* View/overlay action

Do not invent medical certainty. Clearly label these as AI-assisted findings.

## 8. RETINAL STRUCTURE PANEL

Show:

Optic Disc

* Detected
* Confidence
* Center/location

Fovea

* Located
* Confidence
* Center/location

Retinal Vessels

* Segmented
* Confidence

Provide buttons:
"View vessel map"
"View optic disc"
"View fovea"

These represent P5's segmentation outputs.

## 9. EXPLAINABILITY PAGE

This is one of the key differentiators of NetraRakshaq.

Create a dedicated "Explainable AI" experience.

Main visualization:
Fundus image + Grad-CAM heatmap overlay.

Add controls:

* Heatmap opacity
* Original
* Enhanced
* Grad-CAM
* Lesion evidence
* Anatomical structures

Add an "AI Reasoning Summary" panel.

Example:

"Primary evidence associated with the prediction:"

1. Multiple microaneurysm-like regions
2. Scattered retinal hemorrhage regions
3. Exudative changes
4. Anatomical context around the macular region

Then show:

"Clinical Criteria Alignment"

DR Level 2:
✓ Microaneurysms
✓ Hemorrhages
✓ Lesion distribution
✓ No evidence of proliferative changes

IMPORTANT:
Do not claim that the AI "thinks" like a doctor.
Frame this as:
"Visual evidence associated with the model prediction."

Add:
"Confidence: 93.1%"
"Calibration status: Validated on held-out evaluation set" only where appropriate in prototype copy.

## 10. CLINICAL REVIEW WORKFLOW

Create a human-in-the-loop review page.

Layout:

LEFT:
Large retinal image + overlays.

CENTER:
AI findings and evidence.

RIGHT:
Clinical review panel.

Actions:

* Confirm AI Assessment
* Modify Assessment
* Request Recapture
* Refer to Ophthalmologist
* Mark for Follow-up

Include a "Review Notes" text area.

Show:
"AI recommendation: REFER"

Reason:
"Referable diabetic retinopathy detected."

Add a review timer:
"Review time: 00:18"

The design should communicate that AI assists the clinician rather than replacing the clinician.

## 11. SCREENING QUEUE

Create a table for clinicians.

Columns:
Patient ID
Image Quality
DR Level
Confidence
Referable
AI Status
Clinical Review
Timestamp

Add filters:

* All
* Awaiting Review
* Referable
* Non-referable
* Recapture Required
* High Confidence
* Low Confidence

Add search.

Use badges and subtle visual priority.

## 12. REPORT PAGE

Create a professional automated screening report.

Header:
NetraRakshaq Screening Report

Patient information should use DEMO IDs only.

Sections:

* Image quality
* DR assessment
* Lesion findings
* Retinal structures
* Explainability
* AI confidence
* Recommendation
* Clinical review

Add:
"AI-assisted screening — clinician review recommended."

Provide:

* Download PDF
* Print
* Share / Export

The report should look like something that could realistically be reviewed by an ophthalmologist.

## 13. SIMULATION PAGE — IMPORTANT FOR OUR HACKATHON

Create a separate "Deployment Simulation" dashboard representing P6's Simulink model.

Title:
"Rural Screening Capacity Simulator"

Subtitle:
"Model telemedicine capacity, throughput and resource allocation."

Show controls:

Patients/day
Operating hours
Number of cameras
Bandwidth
AI processing time
Recapture rate
Number of ophthalmologists
Average review time

Show outputs:

Annual screening capacity
Current throughput
Average waiting time
Peak queue
Camera utilization
Reviewer utilization
Bottleneck
Estimated patients served/year

Add scenario selector:

* Baseline
* Low Resource
* Standard District
* High Volume
* 100,000+ Patients / Year

Create visualizations:

* Patient throughput
* Queue length
* Resource utilization
* Bottleneck comparison

Add an "Optimization Recommendation" card.

Example:
"Clinical review is currently the limiting resource."
"Adding one reviewer increases annual screening capacity more than adding another acquisition station."

Clearly label these as simulation outputs, not real-world measurements unless actual values are supplied.

## 14. SYSTEM ARCHITECTURE PAGE

Create a beautiful technical architecture visualization.

Show:

Fundus Camera
↓
Image Quality & Enhancement
↓
Retinal Structure Segmentation
↓
Lesion Detection
↓
DR Severity Classification
↓
Explainability
↓
Clinical Review
↓
Referral / Report

Parallel branch:

Operational Metrics
↓
Simulink
↓
Capacity Optimization

Represent team modules visually:

P1 — Product / Full Stack
P2 — DR Classification
P3 — Lesion Detection & Explainability
P4 — Image Quality & Enhancement
P5 — Retinal Segmentation
P6 — Simulation & Validation

Make this page useful for hackathon judges to understand the architecture instantly.

## 15. SETTINGS / SYSTEM PAGE

Create a professional system configuration page.

Sections:

* AI model status
* Dataset / evaluation status
* API connection
* MATLAB processing service
* Simulink simulation
* Storage
* System health

Use statuses:
Connected
Processing
Warning
Offline

Do not expose real API keys or secrets.

## 16. DEMO DATA

Populate the prototype with realistic-looking but clearly fictional DEMO data.

Use patient IDs such as:
PT-10021
PT-10022
PT-10023

Do NOT use real patient information.

Use realistic example values for UI demonstration, but clearly label them as:
"Demo data"

The frontend must be designed so these static values can later be replaced by real API responses.

## 17. FUTURE AI INTEGRATION — VERY IMPORTANT

Architect the frontend around a clean data contract.

Do NOT hard-code medical logic directly into visual components.

Create a mock service/data layer representing future APIs.

The future architecture should support:

Frontend
↓
Backend API
↓
P4 MATLAB image quality
↓
P5 retinal segmentation
↓
P3 lesion detection + explainability
↓
P2 DR classification
↓
Unified screening result
↓
Frontend

The current prototype can use mock JSON responses.

Make it obvious in the code structure where these mock services can later be replaced by:

* MATLAB
* Python AI services
* REST APIs
* Database
* Real model inference

Do not build fake AI that pretends to actually diagnose patients.

## 18. DESIGN SYSTEM

Create reusable components:

* Sidebar
* Header
* KPI cards
* Status badges
* Progress indicators
* Clinical metric cards
* Image viewer
* Overlay controls
* Confidence meter
* Evidence cards
* Tables
* Charts
* Modal dialogs
* Toast notifications
* Empty states
* Loading states
* Error states

Use consistent spacing and component behavior.

## 19. INTERACTIONS

Make the prototype genuinely interactive.

Examples:

Click a patient → opens result page.

Click "Original" / "Enhanced" → changes retinal image.

Click "Grad-CAM" → displays heatmap overlay.

Click "Vessel Overlay" → displays vessel segmentation.

Click lesion type → highlights relevant evidence.

Click "Refer" → updates review state.

Click "Request Recapture" → changes case status.

Simulation controls → update charts/metrics.

Filters → update queue.

Search → filters patients.

Sidebar → navigates between application sections.

Use subtle transitions, not excessive animations.

## 20. ACCESSIBILITY & CLINICAL UX

Prioritize:

* High contrast
* Clear typography
* Large enough click targets
* Keyboard-friendly navigation
* Meaningful icons with labels
* Do not rely on color alone to communicate status
* Clear warnings
* Minimal cognitive overload

Clinical users should be able to understand the result within seconds.

## 21. IMPORTANT MEDICAL SAFETY / LANGUAGE

This is an engineering prototype.

Never present demo results as actual diagnoses.

Use wording such as:

* "AI-assisted assessment"
* "Model prediction"
* "AI-associated evidence"
* "Referable according to model output"
* "Clinician review recommended"

Avoid:

* "Guaranteed diagnosis"
* "100% accurate"
* "Doctor replacement"
* Unsupported clinical claims

Do not claim >90% sensitivity or >85% specificity unless those metrics are actually supplied by validated evaluation data.

## 22. VISUAL QUALITY BAR

The final result should feel comparable to a premium modern clinical AI SaaS product.

Think:

* sophisticated medical imaging workstation
* modern AI research platform
* enterprise clinical dashboard
* minimal but information-rich
* extremely polished typography
* strong visual hierarchy
* excellent spacing
* elegant data visualization
* beautiful retinal-image presentation

The retinal image should be the visual hero of the clinical result screen.

Avoid making every card look identical.

Create hierarchy:

1. Patient/result
2. Retinal image
3. DR assessment
4. Evidence
5. Explainability
6. Supporting metrics

## 23. BUILD ORDER

Because this is a complex application, first create a structured implementation plan covering:

1. Information architecture
2. Routes/pages
3. Component system
4. Design tokens
5. Mock data model
6. Interaction model
7. Future API integration points

Then implement the application.

Prioritize layout and visual quality first, followed by interactions and prototype functionality.

At the end, review the entire application for:

* visual consistency
* responsiveness
* accessibility
* realistic clinical UX
* no placeholder lorem ipsum
* no broken interactions
* no contradictory medical terminology
* no fake claims
* consistent NetraRakshaq branding

The final output should be a **complete polished interactive clinical AI screening platform prototype**, not merely a landing page.
