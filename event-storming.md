# Event Storming: Applicant Tracking System (ATS)

## Overview
Platform rekrutmen end-to-end yang membantu HR mengelola lowongan, screening kandidat, penjadwalan interview, dan onboarding — mulai dari job posting hingga kandidat diterima.

---

## Actors (Pengguna)
- **HR / Recruiter** — mengelola lowongan dan proses rekrutmen
- **Hiring Manager** — memberi keputusan akhir penerimaan kandidat
- **Applicant / Kandidat** — melamar dan mengikuti proses seleksi
- **Interviewer** — melakukan interview dan memberi penilaian

---

## Domain Events (Kejadian yang terjadi)

### Job Posting
- `JobCreated` — HR membuat lowongan baru
- `JobPublished` — lowongan dipublikasikan ke platform
- `JobClosed` — lowongan ditutup (tidak menerima lamaran baru)
- `JobReopened` — lowongan dibuka kembali

### Application
- `ApplicationSubmitted` — kandidat mengirim lamaran
- `ApplicationReceived` — sistem menerima dan mencatat lamaran
- `ApplicationDuplicated` — kandidat melamar posisi yang sama lebih dari sekali
- `ApplicationWithdrawn` — kandidat menarik lamarannya

### Screening
- `ResumeScreened` — HR melakukan review resume
- `ApplicationShortlisted` — kandidat lolos screening awal
- `ApplicationRejected` — kandidat tidak lolos di tahap ini
- `RejectionEmailSent` — email penolakan dikirim ke kandidat

### Interview
- `InterviewScheduled` — jadwal interview dibuat
- `InterviewInvitationSent` — undangan interview dikirim ke kandidat
- `InterviewConfirmed` — kandidat mengkonfirmasi kehadiran
- `InterviewRescheduled` — jadwal interview diubah
- `InterviewCancelled` — interview dibatalkan
- `InterviewConducted` — interview berlangsung
- `InterviewFeedbackSubmitted` — interviewer mengisi feedback/penilaian

### Decision
- `CandidateAdvanced` — kandidat lanjut ke tahap berikutnya
- `OfferGenerated` — surat penawaran kerja dibuat
- `OfferSent` — offer dikirim ke kandidat
- `OfferAccepted` — kandidat menerima penawaran
- `OfferDeclined` — kandidat menolak penawaran
- `OfferNegotiated` — kandidat meminta negosiasi gaji/benefit
- `CandidateHired` — kandidat resmi diterima

### Onboarding
- `OnboardingInitiated` — proses onboarding dimulai
- `DocumentsRequested` — dokumen persyaratan diminta
- `DocumentsSubmitted` — kandidat mengumpulkan dokumen
- `BackgroundCheckRequested` — pemeriksaan latar belakang diminta
- `BackgroundCheckCompleted` — pemeriksaan latar belakang selesai
- `OnboardingCompleted` — proses onboarding selesai

---

## Commands (Perintah yang memicu event)

| Command | Triggered By | Resulting Event |
|---|---|---|
| `CreateJob` | HR | `JobCreated` |
| `PublishJob` | HR | `JobPublished` |
| `CloseJob` | HR / System | `JobClosed` |
| `SubmitApplication` | Kandidat | `ApplicationSubmitted` → `ApplicationReceived` |
| `ScreenResume` | HR | `ApplicationShortlisted` / `ApplicationRejected` |
| `ScheduleInterview` | HR | `InterviewScheduled` → `InterviewInvitationSent` |
| `SubmitFeedback` | Interviewer | `InterviewFeedbackSubmitted` |
| `AdvanceCandidate` | Hiring Manager | `CandidateAdvanced` |
| `GenerateOffer` | HR | `OfferGenerated` → `OfferSent` |
| `AcceptOffer` | Kandidat | `OfferAccepted` → `CandidateHired` |
| `DeclineOffer` | Kandidat | `OfferDeclined` |
| `InitiateOnboarding` | HR / System | `OnboardingInitiated` |
| `CompleteOnboarding` | HR | `OnboardingCompleted` |

---

## Aggregates (Entitas inti)

### Job
- State: `draft`, `published`, `closed`
- Fields: `title`, `department`, `location`, `type` (full-time/part-time/remote), `deadline`
- Menangani: lifecycle lowongan dan kuota pelamar

### Application
- State: `received`, `screening`, `shortlisted`, `interviewing`, `offered`, `hired`, `rejected`, `withdrawn`
- Fields: `candidateId`, `jobId`, `resumeUrl`, `coverLetter`, `appliedAt`
- Menangani: seluruh perjalanan kandidat dari apply hingga keputusan akhir

### Interview
- State: `scheduled`, `confirmed`, `completed`, `cancelled`, `rescheduled`
- Fields: `applicationId`, `interviewerId`, `type` (HR/technical/final), `scheduledAt`, `platform`, `notes`
- Menangani: penjadwalan dan hasil interview

### Offer
- State: `draft`, `sent`, `accepted`, `declined`, `negotiating`, `expired`
- Fields: `applicationId`, `salary`, `startDate`, `benefits`, `expiresAt`
- Menangani: pembuatan dan negosiasi penawaran kerja

### Candidate
- State: `active`, `hired`, `blacklisted`
- Fields: `name`, `email`, `phone`, `linkedinUrl`, `resumeUrl`
- Menangani: data personal kandidat lintas lamaran

---

## Policies / Business Rules

- **DuplicateApplication Policy**: Satu kandidat hanya bisa memiliki 1 lamaran aktif per posisi
- **AutoReject Policy**: Kandidat yang tidak memenuhi kualifikasi minimum (misal: tidak ada degree yang dipersyaratkan) otomatis ditolak
- **OfferExpiry Policy**: Offer yang tidak direspons dalam 7 hari otomatis expired
- **InterviewSlot Policy**: Jadwal interview tidak boleh overlap untuk satu interviewer
- **SLA Policy**: HR wajib merespons lamaran dalam 5 hari kerja setelah diterima
- **FeedbackRequired Policy**: Interview tidak dianggap selesai sampai interviewer mengisi feedback

---

## Pipeline / Tahapan Rekrutmen

```
Kandidat HR / System
 │
 ├─[SubmitApplication]──────► ApplicationReceived
 │ │
 │ [ScreenResume]
 │ ┌──────────┴──────────┐
 │ │ │
 │ Shortlisted Rejected
 │ │ │
 │ [ScheduleInterview] RejectionEmailSent
 │ │
 │ InterviewScheduled
 │ │
 │ [SubmitFeedback]
 │ │
 │ [AdvanceCandidate / Reject]
 │ │
 │ [GenerateOffer]
 │ │
 │ OfferSent
 │ │
 ├─[AcceptOffer]────────────┤
 │ │
 │ CandidateHired
 │ │
 │ [InitiateOnboarding]
 │ │
 └─[SubmitDocuments]──────► OnboardingCompleted

---

## UI Components yang Dibutuhkan

| Komponen | Fungsi |
|---|---|
| `JobBoard` | Daftar lowongan yang tersedia (public) |
| `JobForm` | Form buat/edit lowongan (HR) |
| `ApplicationForm` | Form lamaran kandidat |
| `KanbanPipeline` | Board status kandidat per tahap (Trello-style) |
| `CandidateProfile` | Detail kandidat & riwayat lamaran |
| `InterviewScheduler` | Penjadwalan interview dengan calendar |
| `FeedbackForm` | Form penilaian interview oleh interviewer |
| `OfferBuilder` | Template dan generator surat penawaran |
| `OnboardingChecklist` | Checklist dokumen dan task onboarding |
| `RecruitmentDashboard` | Statistik: jumlah pelamar, konversi tiap tahap, time-to-hire |

---

## Technical Notes

- **State Management**: React Query untuk server state + Zustand untuk UI state
- **Real-time**: WebSocket / SSE untuk notifikasi perubahan status kandidat
- **Email**: Integrasi email service (SendGrid/Resend) untuk notifikasi otomatis
- **Calendar**: Google Calendar API untuk penjadwalan interview
- **Storage**: S3-compatible storage untuk upload resume dan dokumen
- **Auth**: Role-based access (HR, Hiring Manager, Interviewer, Kandidat)
- **Framework**: Next.js 15 dengan TypeScript + Prisma ORM
- **Database**: PostgreSQL

``