// src/utils/emails/html-templates.ts

export function generateVerificationEmailHtml(verificationLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Sprinter</title>
    </head>
    <body style="
      background-color: #2d2d2d;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    ">

      <!-- Header -->
      <div style="
        background-color: #1e90ff;
        padding: 40px 0px;
        text-align: center;
        width: 100%
      ">
        <h1 style="
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 10px 0;
        ">🏃🏻‍♀️‍➡️ <i>SPRINTER</h1>
        <p style="
          color: white;
          font-size: 18px;
          margin: 0;
        ">Verify your email address</p>
      </div>

      <div style="max-width: 600px; margin: 0 auto;">
        <!-- Main Content -->
        <div style="
          background-color: #2d2d2d;
          padding: 40px 20px;
          color: white;
        ">
          <p style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: white;
          ">Hi!</p>
          
          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">Thanks for signing up for Sprinter, your all-in-one workspace for planning, managing, and delivering projects efficiently.</p>
          
          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">You're just one step away from getting started.</p>
          
          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">Simply click the link below to verify your email address to activate your account</p>

          <!-- Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="
              background-color: #1e90ff;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 14px;
              font-weight: 500;
              display: inline-block;
            ">Verify email address</a>
          </div>

          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">Or copy and paste this link on your browser</p>
          
          <p style="
            font-size: 12px;
            color: #1e90ff;
            word-break: break-all;
            margin: 0 0 16px 0;
          ">${verificationLink}</p>

          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">This link will expire in 12 hours.</p>

          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">If you didn't sign up for Sprinter, you can safely ignore this email. No changes will be made to your account</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px;">
          <p style="
            font-size: 12px;
            color: #888;
            margin: 5px 0;
          ">
            <a href="mailto:Support@sprinter.app" style="color: #1e90ff; text-decoration: none;">
              Support@sprinter.app
            </a>
          </p>
          <p style="
            font-size: 12px;
            color: #888;
            margin: 5px 0;
          ">
            <a href="https://www.sprinter.app" style="color: #1e90ff; text-decoration: none;">
              www.sprinter.app
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmailHtml(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Sprinter</title>
    </head>
    <body style="
      background-color: #2d2d2d;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    ">

      <!-- Header -->
      <div style="
        background-color: #1e90ff;
        padding: 40px 0px;
        text-align: center;
        width: 100%
      ">
        <h1 style="
          color: white;
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 10px 0;
        ">🏃🏻‍♀️‍➡️ <i>SPRINTER</h1>
        <p style="
          color: white;
          font-size: 18px;
          margin: 0;
        ">Reset Your Password</p>
      </div>

      <div style="max-width: 600px; margin: 0 auto;">
        <!-- Main Content -->
        <div style="
          background-color: #2d2d2d;
          padding: 40px 20px;
          color: white;
        ">
          <p style="
            font-size: 16px;
            margin: 0 0 20px 0;
            color: white;
          ">Hi!</p>
          
          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">We received a request to reset your password for your Sprinter account.</p>
          
          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">Click the button below to choose a new password:</p>

          <!-- Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="
              background-color: #1e90ff;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-size: 14px;
              font-weight: 500;
              display: inline-block;
            ">Reset Password</a>
          </div>

          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">If the button doesn't work, copy and paste this link into your browser:</p>
          
          <p style="
            font-size: 12px;
            color: #1e90ff;
            word-break: break-all;
            margin: 0 0 16px 0;
          ">${resetLink}</p>

          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          "><strong>This link will expire in 15 minutes.</strong></p>

          <p style="
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 16px 0;
            color: #e0e0e0;
          ">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px;">
          <p style="
            font-size: 12px;
            color: #888;
            margin: 5px 0;
          ">
            <a href="mailto:Support@sprinter.app" style="color: #1e90ff; text-decoration: none;">
              Support@sprinter.app
            </a>
          </p>
          <p style="
            font-size: 12px;
            color: #888;
            margin: 5px 0;
          ">
            <a href="https://www.sprinter.app" style="color: #1e90ff; text-decoration: none;">
              www.sprinter.app
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}