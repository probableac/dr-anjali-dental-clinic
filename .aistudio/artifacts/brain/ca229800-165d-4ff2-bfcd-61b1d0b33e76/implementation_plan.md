# Implementation Plan: Admin-Only Upcoming Appointment Countdown Banner

A real-time, high-priority summary banner rendered at the top of the Home view exclusively for authenticated clinic administrators (Dr. Anjali Bhardwaj and front-desk staff), tracking the next confirmed patient slot from Firestore.

---

## 1. User Intent & Requirements Summary
- **Target Audience**: Only visible to logged-in clinic administrators (authenticated via the existing PIN `1804` or password `serene@noida18`). Regular patients and anonymous visitors will see the standard tranquil patient experience without administrative clutter.
- **Placement**: Compact, high-utility banner at the very top of the Home view, above the main hero section.
- **Core Functionality**:
  - Automatically identifies the earliest upcoming confirmed/scheduled consultation from the real-time appointments stream.
  - Live ticking countdown timer (days, hours, minutes, seconds) updating every second.
  - One-click patient WhatsApp button (pre-filled with clinic confirmation and sensory tray prep details).
  - One-click direct call button (`tel:...`) to dial the patient immediately.
  - Quick-navigation button to open the consultation in the full **Admin Portal**.
  - Collapsible/expandable toggle so the doctor or receptionist can minimize the banner into a sleek status pill while previewing the landing page.

---

## 2. Architecture & Data Flow

```
+----------------------------------------------------------------------------------+
| Firestore / Real-Time Database ('consultations' collection)                      |
| (Synced via onSnapshot listener in api.subscribeConsultations / api.ts)          |
+----------------------------------------+-----------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| App.tsx: State Management                                                        |
| - appointments: Appointment[] (live synced)                                      |
| - isAdmin: boolean (tracks api.isAdminAuthenticated() & session storage)         |
+----------------------------------------+-----------------------------------------+
                                         | passes appointments, isAdmin, onNavigate
                                         v
+----------------------------------------------------------------------------------+
| UpcomingAppointmentBanner (inside src/components/HomeView.tsx)                   |
| 1. Filters appointments: status !== 'Cancelled' && status !== 'Completed'        |
| 2. Computes chronological closest slot >= current time                           |
| 3. Ticks live countdown every 1,000ms (days, hours, minutes, seconds)           |
| 4. Dispatches one-click actions:                                                 |
|    - WhatsApp patient reminder (api.generatePatientConfirmationWhatsAppLink)     |
|    - Phone call (tel:patientPhone)                                               |
|    - Jump to Admin Portal (onNavigate('admin-portal'))                           |
+----------------------------------------------------------------------------------+
```

---

## 3. Proposed Changes

### Component 1: `src/components/UpcomingAppointmentBanner.tsx` (New Component)
Create a dedicated, modular banner component:
- **Authentication Check**: Verifies `isAdmin` prop or `api.isAdminAuthenticated()`. Returns `null` if not logged in.
- **Slot Selection Logic**:
  - Parses date formats (ISO `YYYY-MM-DD` or locale date strings) and time slot strings (e.g., `10:00 AM`, `02:30 PM`) into standard timestamps.
  - Sorts confirmed/pending appointments chronologically.
  - Selects the earliest slot occurring in the future or currently ongoing today.
- **Timer Engine**:
  - `useEffect` with a 1-second interval calculating `{ days, hours, minutes, seconds, isPast, isToday, isNow }`.
  - Handles overdue or currently in-progress appointments gracefully (e.g., "In Progress / Checked In").
- **Design & UI**:
  - Emerald administrative badge: `Admin View • Next Scheduled Consult`.
  - Patient summary: Patient Name, procedure (`treatmentName`), doctor assigned (`Dr. Anjali Bhardwaj`), and date/time.
  - Live visual countdown badge with pulsing indicator.
  - Actions:
    - **WhatsApp Patient**: Opens WhatsApp Web / App pre-loaded with confirmation message.
    - **Call Patient**: Immediate `tel:` dialer.
    - **Manage in Admin Portal**: Jumps to `admin-portal` tab.
    - **Minimize / Expand Toggle**: Allows collapsing into a sleek pill header.

### Component 2: `src/components/HomeView.tsx` (Update)
- Import and mount `UpcomingAppointmentBanner` at the top of the Home view container.
- Accept `appointments` and `isAdmin` as props from `App.tsx` (with fallback to `api.isAdminAuthenticated()`).
- Pass down navigation handler `onNavigate`.

### Component 3: `src/App.tsx` (Update)
- Maintain `isAdmin` state synced with `api.isAdminAuthenticated()`.
- Listen for admin login/logout events or state changes when transitioning between AdminPortal and other views.
- Pass `appointments` and `isAdmin` to `HomeView`.

---

## 4. Verification Plan

### Automated Build & Compilation
- Run `compile_applet` to ensure clean TypeScript compilation with zero errors.
- Run `lint_applet` to ensure code style and import cleanliness.

### Functional Verification
1. **Anonymous / Patient View**:
   - Access Home view while logged out.
   - Confirm that the banner is **completely hidden** and regular visitors see only the serene clinic branding.
2. **Admin View (Logged In)**:
   - Log into Admin Portal with PIN `1804`.
   - Navigate to the Home view.
   - Confirm the banner appears at the very top of the Home view.
   - Verify that the banner displays the patient's name, procedure, assigned doctor, and scheduled time slot.
   - Verify that the countdown ticks every second accurately.
   - Click the WhatsApp action to confirm the message payload is formatted correctly.
   - Click the Call action to confirm standard `tel:` protocol.
   - Click "Open in Admin Portal" to confirm instant routing.
   - Click the collapse/expand toggle to test minimal pill view.
