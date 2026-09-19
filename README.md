# Online Weighing & Measuring Instrument Verification System
### Smart India Hackathon Problem SIH26036 — College Mini-Project

---

## 1. Project Abstract & Problem Statement

### The Problem
Commercial establishments (grocery shops, supermarkets, gold/jewelry merchants, manufacturing industries) use weighing and measuring instruments for commercial trade. Ensuring the accuracy of these instruments is a statutory duty under the **Legal Metrology Act**. In traditional manual workflows:
- Shop owners face long queues and bureaucratic hurdles to request physical verification and calibration.
- Officers track inspections manually on paper registers, leading to potential tracking errors and lost records.
- Fake, duplicate, or expired inspection paper certificates cannot be quickly verified by consumers or inspectors in the market.

### The Solution
The **Online Weighing & Measuring Instrument Verification System** digitizes this entire lifecycle:
1. **Instrument Registration**: Business owners register their instruments online with unique identification codes and locations.
2. **Verification Requests**: Owners request official verification online with a single click.
3. **Officer Review & Calibration**: Legal Metrology Officers inspect the device, record inspection outcomes (`PASS`/`FAIL`) and calibration remarks, and approve or reject the request.
4. **Digital Certificate & QR Generation**: Approval automatically generates a tamper-evident digital certificate with a unique certificate number (e.g., `LM-2026-0001`), 1-year validity, and a dynamic **ZXing QR code**.
5. **Instant Public QR Verification**: Any customer or inspector can scan the QR code to open the public verification portal and verify whether the certificate is `✅ VALID`, `⚠️ EXPIRED`, or `❌ COUNTERFEIT / NOT FOUND`.
6. **Central Admin Portal**: Administrative oversight with system metrics and audit logs.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, React Router DOM, Axios, Lucide Icons, Modern CSS3 (Government / Legal Metrology theme)
- **Backend**: Java 17+, Spring Boot 3.3.x, Spring Data JPA, Hibernate, Bean Validation
- **QR Code Engine**: Google ZXing (`core` & `javase` 3.5.3)
- **PDF Engine**: OpenPDF (`com.github.librepdf:openpdf:1.3.40`)
- **Database**: PostgreSQL (with automatic zero-setup H2 in-memory fallback enabled out of the box)
- **Build Tools**: Maven 3.9+ (embedded wrapper provided) and Node.js / npm

---

## 3. Demo Credentials (For Faculty Viva & Presentation)

| Role | Email | Password | Pre-seeded Sample Data |
|---|---|---|---|
| **Instrument Owner** | `owner@example.com` | `owner123` | ABC Stores (Salem) — has `WM001` (Pending) and `WM002` (Registered) |
| **Verification Officer** | `officer@example.com` | `officer123` | Officer Ramesh Kumar — Ready to review pending queue |
| **System Admin** | `admin@example.com` | `admin123` | System Administrator — Full analytics and audit tables |

> **Viva Tip**: The UI includes a top **"Quick Demo Role Switcher"** bar and **1-click login buttons** on the sign-in page, so you can switch roles instantly during your faculty demo without typing passwords!

---

## 4. How to Run the Project Locally

### Prerequisites
- **Java 17 or higher** installed (`java -version`)
- **Node.js 18+ and npm** installed (`node -v`)

---

### Step A: Start the Backend (Spring Boot)

1. Open a terminal (PowerShell or Command Prompt) and navigate to the backend folder:
   ```powershell
   cd instrument-verification-system/backend
   ```
2. Run Spring Boot using the included Maven wrapper script:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *(Or if you have Maven installed globally, simply run `mvn spring-boot:run`)*
3. The backend starts at **`http://localhost:8080`**.
   - Demo accounts and sample instruments are automatically seeded.
   - H2 in-memory database console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:sih_instruments`, User: `sa`, Password: empty).

---

### Step B: Start the Frontend (React + Vite)

1. Open a second terminal window and navigate to the frontend folder:
   ```powershell
   cd instrument-verification-system/frontend
   ```
2. Install dependencies (run once):
   ```powershell
   npm.cmd install
   ```
3. Start the Vite development server:
   ```powershell
   npm.cmd run dev
   ```
4. Open your web browser at **`http://localhost:5173`**.

---

## 5. Step-by-Step Viva Demonstration Flow

Follow this exact order to demonstrate the system to your faculty:

1. **Demonstrate Owner Workflow**:
   - Open `http://localhost:5173`. Click the **👤 Owner** 1-click login button.
   - Show the **Establishment Dashboard** for *ABC Stores*.
   - Point out existing instruments: `WM001` (Pending) and `WM002` (Registered).
   - Click **"+ Register New Instrument"** and register a new machine (e.g., `WM004`, `Industrial Platform Scale`, `Salem`).
   - Click **"Request Verification Now"** or click **"Request Verification"** next to `WM002`. Notice its status immediately transitions to `PENDING_VERIFICATION`.

2. **Demonstrate Officer Workflow**:
   - In the top demo switcher bar, click **Officer (Ramesh)**.
   - The officer dashboard displays the **Pending Inspection Queue**.
   - Click **"Review & Inspect"** on instrument `WM001`.
   - Explain to the examiner: *"Here the officer enters physical inspection observations."*
   - Select **PASS**, verify the remarks, and click **"Approve & Issue Certificate"**.
   - Notice the success banner appears: *"Verification APPROVED! Digital Certificate LM-2026-0001 generated with ZXing QR code."*

3. **Demonstrate Digital Certificate & QR Code**:
   - Click **"View Issued Certificate"** (or switch back to Owner and click **"View Certificate"**).
   - Show the official Government of India / Legal Metrology certificate document.
   - Point out the **ZXing generated QR Code** and the digital signature seal.
   - Click **"Download PDF"** — demonstrate the generated official PDF certificate with embedded QR code.

4. **Demonstrate Public QR Verification**:
   - Click the **"Test QR Link"** underneath the QR code (or open `/verify/LM-2026-0001` in a new tab).
   - Show the public verification portal:
     - Shows `✅ OFFICIALLY VERIFIED & VALID` with machine number, owner, issue date, and expiry date.
   - In the search bar on that page, type an invalid number like `LM-FAKE-9999` and click Verify.
   - Show the instant counterfeit alert: `❌ CERTIFICATE NOT FOUND`.

5. **Demonstrate Admin Portal**:
   - In the top bar, click **Admin Portal**.
   - Point out real-time system metrics: Total Instruments, Pending, Verified, Rejected, Total Certificates, and Users.
   - Show the data tables across the tabs: Instruments, Verification Logs, Certificates, and Users.

---

## 6. How to Connect to PostgreSQL (Optional / Production-Ready Setup)

By default, the application runs on **H2 In-Memory DB** so you can run and test it immediately without needing PostgreSQL installed. To switch to PostgreSQL:

1. Open PostgreSQL (pgAdmin or psql) and create the database:
   ```sql
   CREATE DATABASE instrument_verification_db;
   ```
2. Run the script provided in `backend/src/main/resources/schema.sql` to create all tables and constraints.
3. In `backend/src/main/resources/application.properties`, comment out the H2 configuration block and uncomment the PostgreSQL block:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/instrument_verification_db
   spring.datasource.username=postgres
   spring.datasource.password=your_postgres_password
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```
4. Restart the backend.

---

## 7. Faculty Viva Q&A Guide

Prepare for your project viva with these concise, accurate answers:

### Q1: What is the main objective of this project?
> **Answer**: "Under the Legal Metrology Act, commercial weighing and measuring instruments must be regularly inspected and certified. Our project automates the manual paper-based verification process into an end-to-end digital system with online registration, officer calibration inspection, automated certificate issuance with QR codes, and instant public verification to eliminate fraudulent and uncalibrated instruments."

### Q2: What is the system architecture?
> **Answer**: "We used a 3-tier decoupled client-server architecture:
> - **Frontend Presentation Layer**: React with Vite and Axios for an interactive single-page application.
> - **Backend Application Layer**: Java with Spring Boot REST controllers, service layer containing business logic, and repository layer for database abstraction.
> - **Persistence Layer**: PostgreSQL / JPA with Hibernate ORM managing relational entities."

### Q3: How is the QR code generated and how does public verification work?
> **Answer**: "When an officer approves an inspection, our `CertificateService` assigns a unique certificate number (e.g. `LM-2026-0001`) and triggers the Google `ZXing` library in the backend. ZXing encodes the public verification URL (`http://localhost:5173/verify/LM-2026-0001`) into a QR image byte stream and returns a Base64 data URI. When scanned by a phone camera, it directs to our public verification endpoint which queries the database and confirms the validity, calibration date, and authenticity of the instrument."

### Q4: How did you implement role-based access control (RBAC)?
> **Answer**: "We defined 3 roles: `INSTRUMENT_OWNER`, `OFFICER`, and `ADMIN`. The frontend wraps routes in a `ProtectedRoute` component that verifies the user's role before rendering views. On the backend, controllers and services ensure business rules are enforced (e.g., only an officer can approve/reject, and only an owner can register their own instruments)."

### Q5: How is PDF certificate generation handled?
> **Answer**: "We integrated `OpenPDF`, a free open-source Java library. When `/api/certificates/{id}/pdf` is requested, the backend dynamically draws the official Legal Metrology certificate, embeds the instrument details, issue/expiry dates, and inserts the generated ZXing QR code image into the PDF, streaming the PDF bytes back to the browser as a downloadable file."

### Q6: What happens if a certificate reaches its expiry date?
> **Answer**: "Every certificate is issued with an `issueDate` and an `expiryDate` (valid for 1 year). The system dynamically compares the certificate's expiry date against the current system date. When expired, the public verification screen displays a warning badge `⚠️ CERTIFICATE EXPIRED` notifying that commercial use is no longer legal until re-calibrated."

### Q7: What are the future enhancements for this project?
> **Answer**:
> 1. Integration of SMS / WhatsApp automated renewal alerts 30 days before certificate expiry.
> 2. Geolocation / GPS tagging during officer on-site inspection.
> 3. Online fee payment gateway integration (e.g. UPI / Razorpay).
> 4. IoT hardware dongles connected to digital weighing scales for automated real-time accuracy telemetry.
