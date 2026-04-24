import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
});

export async function sendEmail({ to, subject, html }) {
  if (!to) return;
  if (process.env.DISABLE_EMAIL === 'true') {
    console.log(`[email disabled] to=${to} subject=${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'tickets@munmaastricht.org',
    to,
    subject,
    html
  });
}
