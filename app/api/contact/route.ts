// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ── Change this to your email ──────────────────────────────────────────────
const TO_EMAIL = 'jachircano@yahoo.com';
const FROM_EMAIL = 'JIMS Contact <onboarding@resend.dev>';
// ──────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Guard: fail gracefully if env var missing
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service not configured.' },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, projectType, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,          // clicking Reply goes straight to the client
      subject: `New Project Inquiry from ${name} — JIMS Platform`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0f; color: #e5e2e3; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4d8eff 0%, #9b59ff 100%); padding: 32px 40px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em;">
              New Project Inquiry
            </h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.75);">
              Received via vektorq.com
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 40px; background: #1c1b1c; border: 1px solid rgba(255,255,255,0.07);">
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); width: 120px;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3b0;">Name</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 15px; color: #e5e2e3; font-weight: 500;">${name}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3b0;">Email</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <a href="mailto:${email}" style="font-size: 15px; color: #6ea8fe; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3b0;">Project</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                  <span style="font-size: 13px; color: #b98fff; background: rgba(185,143,255,0.1); padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(185,143,255,0.2);">
                    ${projectType || 'Not specified'}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <div style="margin-top: 24px;">
              <p style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3b0; margin: 0 0 10px;">
                Message
              </p>
              <div style="background: #131314; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px 20px;">
                <p style="font-size: 15px; line-height: 1.6; color: #e5e2e3; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <!-- Reply CTA -->
            <div style="margin-top: 28px; text-align: center;">
              <a href="mailto:${email}?subject=Re: Your JIMS Project Inquiry"
                 style="display: inline-block; background: linear-gradient(135deg, #4d8eff, #9b59ff); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Reply to ${name} →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 40px; background: #0e0e0f; text-align: center;">
            <p style="font-size: 11px; color: #424754; margin: 0;">
              JIMS Software Inc. · jism-platform.vercel.app
            </p>
          </div>

        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
