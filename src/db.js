import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('src/data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'app.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  event_name TEXT NOT NULL,
  event_description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  event_location TEXT NOT NULL,
  iban TEXT NOT NULL,
  account_name TEXT NOT NULL,
  price_per_ticket REAL NOT NULL,
  max_tickets INTEGER NOT NULL,
  organizer_email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  quantity INTEGER NOT NULL,
  notes TEXT,
  consent INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_proofs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id)
);

CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  registration_id INTEGER NOT NULL,
  ticket_id TEXT NOT NULL UNIQUE,
  qr_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid',
  issued_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id)
);
`);

const row = db.prepare('SELECT id FROM admin_settings WHERE id = 1').get();
if (!row) {
  db.prepare(`INSERT INTO admin_settings
    (id, event_name, event_description, event_date, event_time, event_location, iban, account_name, price_per_ticket, max_tickets, organizer_email)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(
      'MUN Maastricht Student Party',
      'An unforgettable student night with music, networking, and celebration.',
      '2026-06-06',
      '20:30',
      'Maastricht City Hall Venue',
      'NL00MUNM0000000000',
      'MUN Maastricht',
      20,
      3,
      'organizer@munmaastricht.org'
    );
}

export default db;
