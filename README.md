# MediKiosk — AI-Powered Clinical Intake Platform
> **An assistive pre-consultation medical documentation and document digitization platform for busy public hospitals and AYUSH institutions.**

---

## 1. Project Objective

**MediKiosk** is a patient-friendly clinical intake kiosk designed to streamline the outpatient department (OPD) queue before a patient consults with a physician. It enables patients (or their attendants) to:
1. Record their presenting symptoms, duration, and past medical history in simple terms.
2. Digitize physical documents (previous prescriptions, lab investigations, discharge cards).
3. Generate a structured, human-readable clinical summary draft for the attending doctor.

### ⚠️ Strict Clinical Scope & Non-Diagnostic Principle
- **Assistive Only:** MediKiosk does **not** make independent diagnoses, does **not** prescribe medication, and does **not** replace medical consultation.
- **Physician Oversight:** Every summary is treated strictly as an unverified draft requiring qualified medical officer examination and approval.
- **Immediate Red-Flag Triage:** Conservative, rule-based screening identifies high-risk symptoms (crushing chest pain, severe dyspnea, focal neurological deficits, acute trauma) to immediately halt the kiosk and direct patients to emergency clinical staff.

---

## 2. System Architecture

MediKiosk is structured into three clean, decoupled layers:

```
innotech/
├── frontend/             # React 19, TypeScript, Vite, Tailwind CSS v4
│   ├── src/
│   │   ├── components/   # Header, Emergency Alert, Hero, Workflow, Modals, Footer
│   │   ├── context/      # LanguageContext (Bilingual & Accessibility scaling)
│   │   ├── i18n/         # English & Hindi clinical dictionaries
│   │   └── types/        # TypeScript interfaces for data models
│   └── package.json
├── backend/              # [Phase 3] Node.js, Express, TypeScript, MongoDB (Mongoose)
├── ai-service/           # [Phase 5] Python, FastAPI, Speech & Constrained LLM Adapters
└── README.md             # Project documentation & progress tracking
```

---

## 3. Development Phases

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | **Foundation, UI Design System & Hospital Landing Page** | ✅ **Completed & Verified** |
| **Phase 2** | Patient Intake Flow (Bilingual consent, registration, guided questionnaire) | ⏳ *Next Phase* |
| **Phase 3** | Backend & Database (Node.js/Express, MongoDB persistence, audit logs) | ⏳ Upcoming |
| **Phase 4** | Document Processing & OCR (Upload pipeline, image preprocessing, extraction) | ⏳ Upcoming |
| **Phase 5** | AI Clinical Summary & Red-Flag Rules (Constrained questions, draft generation) | ⏳ Upcoming |
| **Phase 6** | Doctor Dashboard & AYUSH (Physician review, edit/sign-off, Dashavidha Pariksha) | ⏳ Upcoming |
| **Phase 7** | Security, Privacy & Integration (ABDM / FHIR adapters, role-based access) | ⏳ Upcoming |
| **Phase 8** | Integration Testing, Docker & Deployment | ⏳ Upcoming |

---

## 4. Phase 1 Accomplishments

In Phase 1, we established the core foundation and hospital-grade interface:
- **Hospital Visual Language:** Calming, trustworthy aesthetic with clean off-white backgrounds (`#f8fafc`), restrained medical blue (`#0284c7`), and slate/teal accents.
- **Bilingual Support (English & Hindi):** Instant language switching for all headings, labels, instructions, and clinical disclaimers.
- **Dual Entry Points:**
  - **Patient Kiosk Entry:** High-visibility, tactile buttons for elderly and low-literacy users, featuring a demo patient record (`PAT-2026-0842: Ramesh Sharma, 54y`).
  - **Doctor & Staff Portal Entry:** Clinician view demonstrating draft clinical history review, scanned prescription verification, and AYUSH assessment tabs (*Dashavidha Pariksha, Ahara-Vihara*).
- **Emergency Red-Flag Interceptor:** Prominent casualty warning box with casualty counter directions and ambulance emergency dialer (108 / 112).
- **Accessibility Features:** Accessible text size scaler (`A`, `A+`, `A++`), simulated voice-guidance toggle, high-contrast borders, and WCAG-compliant color contrast.
- **Honest Operational Indicators:** Clear transparency box reporting that OCR, speech, and databases are running in local sandbox mode without false claims.

---

## 5. How to Run Locally

### Prerequisites
- Node.js (v18+ recommended; tested on v24.17.0)
- npm (v10+; tested on v11.13.0)

### Running the Frontend
1. Open PowerShell and navigate to the `frontend` folder:
   ```powershell
   cd c:\Users\akg50\Desktop\innotech\frontend
   ```

2. Install dependencies (already initialized):
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5173/
   ```

5. To verify production TypeScript compilation:
   ```powershell
   npm run build
   ```

---

## 6. Known Limitations (Phase 1)
- Currently operates with synthetic in-memory demo patient records.
- Backend API and persistent database connections will be activated in Phase 3.
- Document scanning and OCR extraction pipelines will be integrated in Phase 4.
