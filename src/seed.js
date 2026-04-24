import db from './db.js';

const r = db.prepare(`INSERT INTO registrations
(first_name,last_name,full_name,email,phone,quantity,notes,consent,total_amount,status)
VALUES (?,?,?,?,?,?,?,?,?,?)`).run('Alice','Jansen','Alice Jansen','alice@example.com','+31600000000',2,'Vegetarian',1,40,'proof_uploaded');

const regId = r.lastInsertRowid;
db.prepare('INSERT INTO payment_proofs (registration_id,file_url) VALUES (?,?)').run(regId,'/uploads/example-proof.pdf');

console.log('Seeded sample registration with payment proof.');
