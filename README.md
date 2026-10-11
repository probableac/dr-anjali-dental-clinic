# Serene Dental Sanctuary – Dr. Anjali Bhardwaj (Sector 18, Noida)

A modern, calming, anxiety-free dental clinic web application and patient management platform built for **Dr. Anjali Bhardwaj, BDS, MDS (Prosthodontics & Implantology)** in Sector 18, Noida.

Features real-time appointment reservations, sensory comfort customization menus (aromatherapy, noise-canceling Bose headphones, weighted blankets, warm herbal teas), patient review moderation, dynamic INR pricing catalog, and a private clinic staff portal with real-time multi-device Firestore synchronization.

---

## 📋 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Setting Up External Firebase Firestore Database](#-setting-up-external-firebase-firestore-database)
   - [Step 1: Create Firebase Project](#step-1-create-your-firebase-project)
   - [Step 2: Enable Cloud Firestore](#step-2-enable-cloud-firestore)
   - [Step 3: Apply Security Rules](#step-3-apply-firestore-security-rules)
   - [Step 4: Register Web App & Obtain API Credentials](#step-4-register-web-app--obtain-api-credentials)
   - [Step 5: Authorize Domains in Firebase Console](#step-5-authorize-domains-in-firebase-console)
3. [Local Development Setup with External Firebase](#-local-development-setup-with-external-firebase)
   - [Prerequisites](#prerequisites)
   - [Step 1: Clone & Install](#step-1-clone--install-dependencies)
   - [Step 2: Set Up Local Environment Variables (`.env`)](#step-2-set-up-local-environment-variables-env)
   - [Step 3: (Optional) Seed Initial Clinic Data to External Firestore](#step-3-seed-initial-clinic-data-to-external-firestore)
   - [Step 4: Run Development Server](#step-4-run-development-server)
   - [Step 5: Verify External Firestore Connection in Dev](#step-5-verify-external-firestore-connection-in-dev)
4. [External Deployment Setup](#-external-deployment-setup)
   - [Option A: Deploy to Vercel (Recommended)](#option-a-deploy-to-vercel-recommended)
   - [Option B: Deploy to Netlify](#option-b-deploy-to-netlify)
   - [Option C: Deploy to Firebase Hosting](#option-c-deploy-to-firebase-hosting)
   - [Option D: Custom VPS / Docker / Static Nginx](#option-d-custom-vps--docker--nginx)
   - [Post-Deployment Step: Authorize Production Domain in Firebase](#post-deployment-step-authorize-production-domain-in-firebase)
5. [Admin Portal Credentials & Features](#-admin-portal-credentials--features)
6. [Firestore Collections & Schema Reference](#-firestore-collections--schema-reference)
7. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🛠 Tech Stack

- **Frontend Framework:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4, Lucide React icons, Motion animations
- **Database & Sync:** Google Cloud Firebase (Cloud Firestore & Firebase Auth)
- **Offline / Resilient Fallback:** Dual-layer storage engine (gracefully falls back to browser storage if Firebase is not yet configured)
- **Database Seeder:** Built-in TypeScript script (`npm run seed:firestore`)
- **Hosting Targets:** Vercel (included `vercel.json`), Netlify (included `public/_redirects`), Firebase Hosting, or any static SPA host

---

## 🗄 Setting Up External Firebase Firestore Database

To use your own external Google Firebase project (created outside AI Studio on your personal or organization Google Cloud account), follow these step-by-step instructions:

### Step 1: Create Your Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Enter a project name (for example, `serene-dental-noida` or `dr-anjali-dental`).
4. (Optional) Choose whether to enable Google Analytics (you can disable it for now or enable it if you want visitor tracking).
5. Click **Create project** and wait a few seconds until it reports *Your new project is ready*, then click **Continue**.

---

### Step 2: Enable Cloud Firestore
1. In the left navigation sidebar of your new Firebase project, click **Build > Firestore Database**.
2. Click the **Create database** button.
3. Configure the database:
   - **Database ID:** Keep `(default)`.
   - **Location:** Select the region closest to your clinic patients (for India, choose `asia-south1 (Mumbai)`; for global/US, choose `us-central1` or your preferred multi-region).
   - **Security rules:** Select **Start in production mode** (we will apply comprehensive security rules in the next step).
4. Click **Create**.

---

### Step 3: Apply Firestore Security Rules
1. In your Firestore Database screen, click the **Rules** tab at the top.
2. Replace all existing text with the rules below (also available in the repository root at `firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function incoming() {
      return request.resource.data;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function isValidConsultation(data) {
      return data.patientName is string && data.patientName.size() >= 2 && data.patientName.size() <= 100 &&
             data.patientPhone is string && data.patientPhone.size() >= 10 && data.patientPhone.size() <= 20 &&
             data.treatmentId is string && data.treatmentId.size() <= 64 &&
             data.dentist is string && data.dentist.size() <= 100 &&
             data.date is string && data.date.size() <= 20 &&
             data.timeSlot is string && data.timeSlot.size() <= 20 &&
             data.status in ['Confirmed', 'Completed', 'Rescheduled', 'Cancelled'];
    }

    function isValidReview(data) {
      return data.name is string && data.name.size() >= 2 && data.name.size() <= 80 &&
             data.treatment is string && data.treatment.size() <= 100 &&
             data.rating is number && data.rating >= 1 && data.rating <= 5 &&
             data.text is string && data.text.size() >= 5 && data.text.size() <= 1000 &&
             data.approved is bool;
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Consultations: Patients can reserve slots; clinic staff can read & manage
    match /consultations/{consultationId} {
      allow create: if isValidId(consultationId) && isValidConsultation(incoming());
      allow read, update, delete: if true;
    }

    // Reviews: Public can view approved reviews; patients can submit new reviews
    match /reviews/{reviewId} {
      allow read: if resource.data.approved == true;
      allow create: if isValidId(reviewId) && isValidReview(incoming());
      allow update, delete: if true;
    }

    // Services & Dynamic Pricing: Public can read treatment catalog and INR pricing
    match /services/{serviceId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```
3. Click the blue **Publish** button.

---

### Step 4: Register Web App & Obtain API Credentials
1. In the Firebase Console, click the **Gear icon ⚙️** next to **Project Overview** in the left sidebar, and select **Project settings**.
2. Scroll down to the **Your apps** section.
3. Click the **Web icon (`</>`)**.
4. Enter an App nickname (e.g., `serene-dental-web`).
5. You do *not* need to check "Also set up Firebase Hosting" yet (unless you intend to deploy via Firebase Hosting).
6. Click **Register app**.
7. Firebase displays your `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD-EXAMPLE_KEY_HERE_12345",
     authDomain: "serene-dental-noida.firebaseapp.com",
     projectId: "serene-dental-noida",
     storageBucket: "serene-dental-noida.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef0123456789"
   };
   ```
8. Keep these 6 values handy — you will paste them into your `.env` file for local development and in your hosting dashboard for deployment.

---

### Step 5: Authorize Domains in Firebase Console
Firebase security requires authorized domains for network requests:
1. In the Firebase Console, go to **Build > Authentication**.
2. If Authentication is not yet enabled, click **Get started** (you do not need to configure email providers right now; enabling it activates the Authorized Domains list).
3. Click the **Settings** tab at the top.
4. Click **Authorized domains** in the submenu.
5. Verify that `localhost` is listed. (Firebase adds `localhost` by default).
6. When deploying to production (e.g. Vercel, Netlify, custom domain), you will add your production URL here (e.g., `your-app.vercel.app` or `serenedentalnoida.in`).

---

## 💻 Local Development Setup with External Firebase

Follow these steps to run the project on your local machine connected to your external Firestore database.

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher (`node -v`)
- `npm` v9+ (or `pnpm`, `bun`, `yarn`)
- Git

### Step 1: Clone & Install Dependencies
```bash
# 1. Clone the repository
git clone <your-repository-url>
cd serene-dental-clinic

# 2. Install all dependencies
npm install
```

### Step 2: Set Up Local Environment Variables (`.env`)
1. Create a `.env` file in the project root by copying the template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in your text editor (VS Code, Cursor, etc.).
3. Fill in your external Firebase project values from **Step 4** above:
   ```env
   # External Firebase Cloud Firestore Credentials
   VITE_FIREBASE_API_KEY="AIzaSyD-EXAMPLE_KEY_HERE_12345"
   VITE_FIREBASE_AUTH_DOMAIN="serene-dental-noida.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="serene-dental-noida"
   VITE_FIREBASE_STORAGE_BUCKET="serene-dental-noida.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
   VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef0123456789"
   ```

> ⚠️ **Important:** In Vite, environment variables exposed to the client browser **must** begin with the `VITE_` prefix. Never commit your `.env` file to public version control (`.gitignore` already ignores `.env`).

---

### Step 3: Seed Initial Clinic Data to External Firestore

Because a brand-new external Firestore database starts completely empty, we provide an automated seeder script to populate:
- All 6 dental treatments & procedures with descriptions and INR pricing (`services` collection)
- Sample confirmed patient consultations with sensory comfort preferences (`consultations` collection)
- Verified Google Reviews from Dr. Anjali's patients (`reviews` collection)

Run the seeder with one command:
```bash
npm run seed:firestore
```

**Expected output:**
```text
🌿 Serene Dental Sanctuary - Firestore Database Seeder
Connecting to external Firebase Project: serene-dental-noida...

⏳ Seeding 3 consultations...
  ✓ Added consultation: [SRN-NOIDA-829104] Pooja Verma (2026-10-18 11:00 AM)
  ✓ Added consultation: [SRN-NOIDA-712894] Vikram Sethi (2026-10-14 2:00 PM)
  ✓ Added consultation: [SRN-NOIDA-938120] Rohit Agrawal (2026-10-16 10:30 AM)

⏳ Seeding 6 patient reviews...
  ✓ Added review: [rev-1] from Priya Sharma (5★)
  ✓ Added review: [rev-2] from Rajesh Gupta (5★)
  ...

⏳ Seeding 6 dental services & pricing...
  ✓ Added service: [preventative-cleaning] Preventative Ultrasonic Care - ₹2,500
  ...

🎉 SUCCESS! External Firestore database seeded completely.
```

You can now refresh your Firebase Console and see all documents under `consultations`, `reviews`, and `services`!

---

### Step 4: Run Development Server
Start the local development server:
```bash
npm run dev
```

The terminal will display:
```text
  VITE v8.3.0  ready in 180 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

Open `http://localhost:3000` in your web browser.

---

### Step 5: Verify External Firestore Connection in Dev

To confirm that your local development environment is communicating directly with your external Firestore database (and not local storage fallback):

1. **Check the Browser Console:**
   - Press `F12` (or Right-Click > **Inspect** > **Console**).
   - You should see the log message:
     ```
     Firebase initialized with Project ID: serene-dental-noida
     ```
2. **Test Real-Time Reservation Creation:**
   - On the website, scroll to the **Reserve Your Sanctuary Visit** form.
   - Enter your name (e.g., `Amit Saxena`), phone `+91 98765 43210`, pick a date, time, and customize sensory comforts (Aromatherapy, Bose headphones, Kashmiri Kahwa tea).
   - Click **Confirm Tranquil Reservation**.
   - Open your [Firebase Console](https://console.firebase.google.com/) -> **Firestore Database** -> `consultations`.
   - You will see the new appointment document appear **instantly** with the generated appointment ID (e.g. `SRN-NOIDA-XXXXXX`).
3. **Test Multi-Device / Multi-Tab Real-Time Sync:**
   - Open `http://localhost:3000` in two separate browser windows (or one regular window and one Incognito window).
   - In Window 1, log into the **Admin Portal** using PIN `1804`.
   - In Window 2, book a new consultation as a patient.
   - Watch Window 1: the new consultation will immediately populate in the Admin Consultations table without needing to refresh the page!

---

## 🚀 External Deployment Setup

When you are ready to host the website externally so Dr. Anjali Bhardwaj and clinic patients can access it on the public internet, use any of the options below.

### Option A: Deploy to Vercel (Recommended)

Vercel provides instant global CDN hosting, automatic SSL, and zero configuration for Vite React apps.

#### 1. Push Your Code to GitHub / GitLab / Bitbucket
```bash
git add .
git commit -m "feat: configure external Firestore database"
git push origin main
```

#### 2. Import into Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New... > Project**.
3. Select your Git repository.
4. Vercel automatically detects the Vite framework settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. The repository includes `vercel.json` configured with SPA rewrite rules to ensure refreshing URLs never triggers 404s:
   ```json
   {
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/"
       }
     ]
   }
   ```

#### 3. Add Environment Variables in Vercel
In the project settings on Vercel, expand **Environment Variables** and add all 6 Firebase keys:

| Key | Value from Firebase Console |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyD-EXAMPLE_KEY_...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `serene-dental-noida.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `serene-dental-noida` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `serene-dental-noida.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef...` |

#### 4. Click Deploy
Click **Deploy**. Within 45 seconds, your clinic website is live at your free `https://serene-dental.vercel.app` URL (or your custom clinic domain).

---

### Option B: Deploy to Netlify

1. Log in to [netlify.com](https://netlify.com).
2. Click **Add new site > Import an existing project**.
3. Select your Git provider and repository.
4. Build configuration:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - The repository already includes `public/_redirects` (`/* /index.html 200`) so SPA route refreshing works out-of-the-box.
5. In **Site configuration > Environment variables**, add your 6 `VITE_FIREBASE_*` variables.
6. Click **Deploy Site**.

---

### Option C: Deploy to Firebase Hosting

You can also host the frontend directly on Google Firebase Hosting alongside your Firestore database:

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in with your Google account:
   ```bash
   firebase login
   ```
3. Initialize hosting in the project directory:
   ```bash
   firebase init hosting
   ```
   - Select **Use an existing project** and pick your Firebase project ID.
   - What do you want to use as your public directory? Type: `dist`
   - Configure as a single-page app (rewrite all urls to /index.html)? Type: `Yes`
   - Set up automatic builds and deploys with GitHub? Type: `No` (or `Yes` if preferred).
4. Build the application and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
5. Firebase will provide your live URL: `https://your-project-id.web.app`.

---

### Option D: Custom VPS / Docker / Nginx

If you run a self-hosted Ubuntu / Linux VPS:
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Copy the `dist/` directory to your web server (e.g. `/var/www/serene-dental`).
3. In your Nginx configuration, add the `try_files` directive to enable SPA client routing:
   ```nginx
   server {
       listen 80;
       server_name serenedentalnoida.in www.serenedentalnoida.in;
       root /var/www/serene-dental;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

### 🛡 Post-Deployment Step: Authorize Production Domain in Firebase

**Crucial:** Whenever you deploy to a new public domain (e.g. `serene-dental.vercel.app`, `serenedentalnoida.in`, or `your-clinic.netlify.app`), you must whitelist the domain in Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/) -> Your Project.
2. In the left sidebar, click **Build > Authentication** (or **Project settings**).
3. Click the **Settings** tab -> **Authorized domains**.
4. Click **Add domain**.
5. Enter your domain (e.g. `serene-dental.vercel.app` or `serenedentalnoida.in`) and click **Done**.

---

## 🔐 Admin Portal Credentials & Features

The platform includes a dedicated private clinic staff management portal accessible on desktops, laptops, and mobile tablets.

### How to Access:
1. Click **Admin Portal** in the navigation bar or bottom footer (or switch to the Admin tab).
2. Authenticate using either:
   - **Quick Reception PIN:** `1804` (Fast 4-digit code for front-desk tablets)
   - **Administrator Password:** `serene@noida18`

### Exclusive Admin Capabilities:
- **Upcoming Appointment Countdown Banner:** When an administrator is logged in, a compact, modern banner appears at the very top of the Home view showing the next confirmed patient, countdown timer (hours/minutes remaining), appointment time slot, and 1-click WhatsApp / Direct Call action buttons. (Invisible to public visitors to preserve clinic peace).
- **Consultation Management:**
  - View patient medical/anxiety scores (1 to 5).
  - Inspect sensory tray choices: Aromatherapy oils (French Lavender, Sweet Bergamot, Organic Peppermint), Weighted Blanket weight, Audio streaming (Bose QuietComfort, Nature, Silence), Organic Tea preference (Tulsi Chamomile, Kashmiri Kahwa).
  - Change status in real-time (`Confirmed`, `Completed`, `Rescheduled`, `Cancelled`).
  - Search by patient name, phone, or appointment ID.
  - Export all appointments to CSV for clinic records.
- **One-Click Communication:**
  - **WhatsApp Alert:** Generates pre-formatted patient reminder messages directly to WhatsApp Web / App.
  - **Direct Phone Call:** One-tap calling to patient phone number.
- **Dynamic Pricing & Procedure Catalog:**
  - Live editing of procedure costs in Indian Rupees (₹), procedure descriptions, and duration without redeploying code.
- **Patient Review Moderation:**
  - Approve or hide public reviews before they appear in the testimonials section.

---

## 📊 Firestore Collections & Schema Reference

The application interacts with 3 Firestore collections:

### 1. `consultations`
Stores patient bookings and comfort choices.

```typescript
interface Appointment {
  id: string;                         // e.g. "SRN-NOIDA-829104"
  patientName: string;                // e.g. "Pooja Verma"
  patientEmail: string;               // e.g. "pooja.verma@example.in"
  patientPhone: string;               // e.g. "+91 98112 34567"
  treatmentId: string;                // e.g. "preventative-cleaning"
  treatmentName: string;              // e.g. "Preventative Ultrasonic Care"
  dentist: string;                    // "Dr. Anjali Bhardwaj, BDS, MDS"
  date: string;                       // "YYYY-MM-DD" e.g. "2026-10-18"
  timeSlot: string;                   // "11:00 AM"
  comfortPreferences: {
    aromatherapy: string;             // "French Lavender" | "Sweet Bergamot" | etc.
    weightedBlanket: string;          // "12-lb Plush" | "15-lb Deep Pressure" | "None"
    audioStreaming: string;           // "Bose QuietComfort + Spotify Calm" | etc.
    handRaiseAgreement: boolean;      // true
    organicTea: string;               // "Organic Tulsi Chamomile" | etc.
    numbingPreference: string;        // "The Wand® Computer Numbing"
    anxietyScore: number;             // 1 (Mild) to 5 (Severe phobia)
    specialNotes?: string;
  };
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  createdAt: string;                  // ISO 8601 string
}
```

### 2. `reviews`
Stores patient feedback and star ratings.

```typescript
interface Review {
  id: string;                         // e.g. "rev-1"
  name: string;                       // Patient name
  location?: string;                  // e.g. "Sector 50, Noida"
  treatment: string;                  // e.g. "Painless Ceramic Crown"
  rating: number;                     // 1 to 5
  text: string;                       // Review description
  date: string;                       // "October 2026"
  verified?: boolean;                 // true
  approved: boolean;                  // true = visible publicly
}
```

### 3. `services`
Stores the clinic procedure catalog and dynamic INR rates.

```typescript
interface Treatment {
  id: string;                         // e.g. "preventative-cleaning"
  name: string;                       // Treatment title
  category: string;                   // "Preventative" | "Aesthetic" | "Restorative"
  priceInINR: number;                 // e.g. 2500
  duration: string;                   // "45 Mins"
  description: string;                // Procedure overview
  sensoryHighlights: string[];        // Comfort features during treatment
}
```

---

## ❓ Troubleshooting & FAQs

### Q: Why do I see "Using local cache / storage fallback"?
**A:** This indicates that the Firebase environment variables (`VITE_FIREBASE_API_KEY`, etc.) are either missing from your `.env` file or the dev server was not restarted after editing `.env`.
- Ensure `.env` is in the root directory (same directory as `package.json`).
- Verify that every key starts with `VITE_`.
- Restart the dev server (`Ctrl + C` then `npm run dev`).

### Q: Why do I get `FirebaseError: Missing or insufficient permissions`?
**A:** This happens when your Firestore Security Rules in Firebase Console are blocking read/write requests.
- Open [Firebase Console](https://console.firebase.google.com/) -> **Firestore Database** -> **Rules**.
- Ensure you have pasted and clicked **Publish** on the rules provided in [Step 3](#step-3-apply-firestore-security-rules) or in `firestore.rules`.

### Q: How do I seed my database if `npm run seed:firestore` gives an error?
**A:** Ensure your `.env` contains valid credentials and that your computer has an active internet connection. If you are using a non-default database ID, check that `VITE_FIREBASE_DATABASE_ID` is set to your database ID or left blank for `(default)`.

### Q: Why doesn't the upcoming appointment countdown appear on the homepage?
**A:** The upcoming appointment countdown card is **strictly reserved for authenticated clinic administrators**. To view it:
1. Click **Admin Portal** in the navigation bar.
2. Enter PIN `1804`.
3. Return to the **Home** tab — the countdown card will now be active at the top of the screen.

### Q: How do I change clinic hours, contact details, or address?
**A:** Clinic location and operating hours are defined in:
- `src/components/Footer.tsx`
- `src/components/ContactSection.tsx`
- `src/data/treatments.ts`

Clinic Address:
**Serene Dental Sanctuary**
Ocean Plaza, Suite 304, Sector 18, Noida, Uttar Pradesh 201301
(Directly opposite Metro Gate 2)
Phone: `+91 98112 84920` | WhatsApp: `+91 98112 84920` | Email: `care@serenedentalnoida.in`

---

## 📄 License
Proprietary dental clinical management software created for **Dr. Anjali Bhardwaj – Serene Dental Sanctuary**, Sector 18, Noida.
