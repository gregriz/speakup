# MUN Maastricht Event Registration & Manual Payment Verification App

A fully working Node.js web app for student-party registration with **manual bank transfer verification** before ticket issuance.

## Features
- Public landing page and registration flow.
- Payment instructions with IBAN and required payment reference.
- Proof upload (PDF/images, max 5MB).
- Manual organizer approval/rejection.
- Ticket generation with unique `MUN-XXXXXX` style ID + QR code.
- Admin dashboard for registrations, proofs, settings, and tickets.
- Check-in page that prevents duplicate scans/check-ins.
- Email automation hooks for:
  - new payment proof alerts to organizer,
  - proof received confirmation to user,
  - ticket delivery after admin approval.

## Tech
- Express + EJS + SQLite (`better-sqlite3`)
- Multer for uploads
- Nodemailer for email
- QRCode generation

## Run locally
```bash
cp .env.example .env
npm install
npm run seed
npm run start
```
Open: `http://localhost:3000`

## Admin
- URL: `/admin/login`
- Password: `ADMIN_PASSWORD` in `.env` (default `admin123`)

## Required manual verification rule
Uploading proof **never** marks payment as paid.
Only admin approval creates/sends a ticket.
