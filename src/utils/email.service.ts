// src/utils/email.service.ts

import * as nodemailer from 'nodemailer';
import { generateVerificationEmailHtml, generatePasswordResetEmailHtml } from './emails/html-templates';

// Create transporter function to avoid duplication
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

export async function sendVerificationEmail(to: string, link: string) {
  const transporter = createTransporter();
  
  // Use HTML template function
  const emailHtml = generateVerificationEmailHtml(link);

  await transporter.sendMail({
    from: `"Sprinter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email - Sprinter',
    html: emailHtml
  });
}

export async function sendPasswordResetEmail(to: string, link: string) {
  const transporter = createTransporter();
  
  // Use HTML template function
  const emailHtml = generatePasswordResetEmailHtml(link);

  await transporter.sendMail({
    from: `"Sprinter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password - Sprinter',
    html: emailHtml
  });
}