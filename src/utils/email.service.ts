import * as nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, link: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        // port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
  
    await transporter.sendMail({
      from: `"Project Manager App" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              background: #4f46e5; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Sprinter!</h1>
            </div>
            <div class="content">
              <h2>Hi!</h2> 
              <p>Thank you for registering with Sprinter. To complete your registration, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${link}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4f46e5;">${link}</p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Sprinter. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
  }
  

export async function sendPasswordResetEmail(to: string, link: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"Project Manager App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #4f46e5; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hi!</h2> 
            <p>We received a request to reset your password. Click the button below to choose a new password:</p>
            
            <div style="text-align: center;">
              <a href="${link}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">${link}</p>
            
            <p><strong>This link will expire in 15 minutes.</strong></p>
            
            <p>If you didn’t request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Sprinter. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  });
}
