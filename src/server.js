import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import QRCode from 'qrcode';
import ShortUniqueId from 'short-unique-id';
import db from './db.js';
import { sendEmail } from './email.js';

const app = express();
const port = process.env.PORT || 3000;
const uid = new ShortUniqueId({ length: 6, dictionary: 'alphanum_upper' });

const uploadsDir = path.resolve('src/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    cb(null, ok.includes(file.mimetype));
  }
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('src/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('src/public')));
app.use('/uploads', express.static(uploadsDir));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mun-secret',
  resave: false,
  saveUninitialized: false
}));

const getSettings = () => db.prepare('SELECT * FROM admin_settings WHERE id = 1').get();
const currency = new Intl.NumberFormat('en-NL', { style: 'currency', currency: 'EUR' });

app.get('/', (_req, res) => {
  res.render('landing', { settings: getSettings() });
});

app.get('/register', (_req, res) => {
  res.render('register', { settings: getSettings(), error: null, form: {} });
});

app.post('/register', (req, res) => {
  const settings = getSettings();
  const { first_name, last_name, email, phone, quantity, notes, consent } = req.body;
  const qty = Number(quantity);
  if (!first_name || !last_name || !email || !qty || qty > settings.max_tickets || consent !== 'on') {
    return res.status(400).render('register', {
      settings,
      error: `Please complete required fields. Max tickets per registration: ${settings.max_tickets}.`,
      form: req.body
    });
  }

  const full_name = `${first_name.trim()} ${last_name.trim()}`;
  const total_amount = qty * settings.price_per_ticket;
  const info = db.prepare(`INSERT INTO registrations
      (first_name, last_name, full_name, email, phone, quantity, notes, consent, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'registered')`)
    .run(first_name.trim(), last_name.trim(), full_name, email.trim(), phone?.trim() || '', qty, notes?.trim() || '', 1, total_amount);

  res.redirect(`/payment/${info.lastInsertRowid}`);
});

app.get('/payment/:registrationId', (req, res) => {
  const settings = getSettings();
  const registration = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.registrationId);
  if (!registration) return res.status(404).send('Registration not found');
  res.render('payment', { settings, registration, currency, error: null });
});

app.post('/payment/:registrationId/upload', upload.single('proof_file'), async (req, res) => {
  const settings = getSettings();
  const registration = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.registrationId);
  if (!registration) return res.status(404).send('Registration not found');
  if (!req.file) return res.status(400).render('payment', { settings, registration, currency, error: 'Upload failed. Use PDF/JPG/PNG/WEBP, max 5MB.' });

  const fileUrl = `/uploads/${req.file.filename}`;
  db.prepare('INSERT INTO payment_proofs (registration_id, file_url) VALUES (?, ?)').run(registration.id, fileUrl);
  db.prepare("UPDATE registrations SET status = 'proof_uploaded' WHERE id = ?").run(registration.id);

  await sendEmail({
    to: settings.organizer_email,
    subject: 'New Payment Proof Submitted',
    html: `<h3>New Payment Proof Submitted</h3>
      <p><b>Name:</b> ${registration.full_name}</p>
      <p><b>Email:</b> ${registration.email}</p>
      <p><b>Phone:</b> ${registration.phone || 'N/A'}</p>
      <p><b>Quantity:</b> ${registration.quantity}</p>
      <p><b>Total amount:</b> ${currency.format(registration.total_amount)}</p>
      <p><a href="${process.env.APP_URL || `http://localhost:${port}`}${fileUrl}">Open uploaded proof</a></p>`
  });

  await sendEmail({
    to: registration.email,
    subject: 'Payment proof received',
    html: `<p>Your payment proof has been received and is under review.</p>`
  });

  res.render('confirmation');
});

const adminOnly = (req, res, next) => {
  if (!req.session.isAdmin) return res.redirect('/admin/login');
  next();
};

app.get('/admin/login', (_req, res) => res.render('admin-login', { error: null }));
app.post('/admin/login', (req, res) => {
  if (req.body.password === (process.env.ADMIN_PASSWORD || 'admin123')) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.status(401).render('admin-login', { error: 'Invalid password' });
});
app.post('/admin/logout', (req, res) => req.session.destroy(() => res.redirect('/')));

app.get('/admin', adminOnly, (req, res) => {
  const filter = req.query.status;
  const query = filter
    ? `SELECT * FROM registrations WHERE status = ? ORDER BY created_at DESC`
    : `SELECT * FROM registrations ORDER BY created_at DESC`;
  const registrations = filter ? db.prepare(query).all(filter) : db.prepare(query).all();
  const proofs = db.prepare('SELECT * FROM payment_proofs').all();
  const proofMap = Object.fromEntries(proofs.map((p) => [p.registration_id, p]));
  res.render('admin-dashboard', { settings: getSettings(), registrations, proofMap, filter, currency });
});

app.get('/admin/settings', adminOnly, (req, res) => res.render('admin-settings', { settings: getSettings(), ok: req.query.ok }));
app.post('/admin/settings', adminOnly, (req, res) => {
  const { event_name, event_description, event_date, event_time, event_location, iban, account_name, price_per_ticket, max_tickets, organizer_email } = req.body;
  db.prepare(`UPDATE admin_settings SET event_name=?, event_description=?, event_date=?, event_time=?, event_location=?, iban=?, account_name=?, price_per_ticket=?, max_tickets=?, organizer_email=? WHERE id = 1`)
    .run(event_name, event_description, event_date, event_time, event_location, iban, account_name, Number(price_per_ticket), Number(max_tickets), organizer_email);
  res.redirect('/admin/settings?ok=1');
});

app.post('/admin/registration/:id/reject', adminOnly, (req, res) => {
  db.prepare("UPDATE registrations SET status = 'rejected' WHERE id = ?").run(req.params.id);
  res.redirect('/admin');
});

app.post('/admin/registration/:id/approve', adminOnly, async (req, res) => {
  const registration = db.prepare('SELECT * FROM registrations WHERE id = ?').get(req.params.id);
  if (!registration) return res.redirect('/admin');

  db.prepare("UPDATE registrations SET status = 'verified' WHERE id = ?").run(registration.id);

  const ticketId = `MUN-${uid.rnd()}`;
  const qrPayload = `${process.env.APP_URL || `http://localhost:${port}`}/check-in?ticket_id=${ticketId}`;
  const qrCode = await QRCode.toDataURL(qrPayload);

  db.prepare('INSERT INTO tickets (registration_id, ticket_id, qr_code, status) VALUES (?, ?, ?, ?)')
    .run(registration.id, ticketId, qrCode, 'valid');
  db.prepare("UPDATE registrations SET status = 'ticket_sent' WHERE id = ?").run(registration.id);

  const settings = getSettings();
  await sendEmail({
    to: registration.email,
    subject: `Your ticket for ${settings.event_name}`,
    html: `<h2>Ticket issued</h2>
      <p>Hello ${registration.full_name}, your payment has been verified.</p>
      <p><b>Event:</b> ${settings.event_name}</p>
      <p><b>Date:</b> ${settings.event_date} ${settings.event_time}</p>
      <p><b>Location:</b> ${settings.event_location}</p>
      <p><b>Ticket ID:</b> ${ticketId}</p>
      <p><img src="${qrCode}" width="180" alt="Ticket QR code"/></p>`
  });

  res.redirect('/admin/tickets');
});

app.get('/admin/tickets', adminOnly, (_req, res) => {
  const tickets = db.prepare(`SELECT t.*, r.full_name, r.email FROM tickets t
    INNER JOIN registrations r ON t.registration_id = r.id
    ORDER BY t.issued_at DESC`).all();
  res.render('tickets', { tickets });
});

app.get('/check-in', adminOnly, (req, res) => {
  const q = req.query.q || '';
  const ticketId = req.query.ticket_id || '';
  let ticket = null;
  if (q) {
    ticket = db.prepare(`SELECT t.*, r.full_name, r.email FROM tickets t
      INNER JOIN registrations r ON t.registration_id = r.id
      WHERE t.ticket_id = ? OR r.email = ? OR r.full_name LIKE ?`).get(q, q, `%${q}%`);
  } else if (ticketId) {
    ticket = db.prepare(`SELECT t.*, r.full_name, r.email FROM tickets t
      INNER JOIN registrations r ON t.registration_id = r.id
      WHERE t.ticket_id = ?`).get(ticketId);
  }
  res.render('checkin', { ticket, q, ticketId });
});

app.post('/check-in/:ticketId/use', adminOnly, (req, res) => {
  const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(req.params.ticketId);
  if (!ticket) return res.redirect('/check-in?q=not-found');
  if (ticket.status === 'checked_in') return res.redirect(`/check-in?q=${ticket.ticket_id}`);
  db.prepare("UPDATE tickets SET status = 'checked_in' WHERE ticket_id = ?").run(ticket.ticket_id);
  res.redirect(`/check-in?q=${ticket.ticket_id}`);
});

app.listen(port, () => {
  console.log(`MUN app running on http://localhost:${port}`);
});
