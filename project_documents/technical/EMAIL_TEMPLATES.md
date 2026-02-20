# CEO Lab — Email Templates

## Setup Instructions

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Replace each template with the branded versions below
3. When custom domain is ready, switch to custom SMTP (Resend or Gmail SMTP)

---

## Magic Link (Sign In)

**Subject:** `Sign in to CEO Lab`

**Body:**
```html
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;">
  <tr>
    <td style="padding:48px 32px 24px;text-align:center;">
      <span style="font-size:18px;font-weight:700;color:#000;">nk</span>
      <span style="font-size:18px;font-weight:300;color:#000;margin-left:6px;">CEO Lab</span>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 16px;text-align:center;">
      <h1 style="font-size:24px;font-weight:700;color:#000;margin:0 0 8px;">Sign in to CEO Lab</h1>
      <p style="font-size:14px;color:rgba(0,0,0,0.5);margin:0;line-height:1.6;">
        Click the button below to securely sign in to your leadership dashboard. This link expires in 1 hour.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 32px;text-align:center;">
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#000;color:#fff;padding:14px 40px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;">
        Sign In
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 48px;text-align:center;">
      <p style="font-size:12px;color:rgba(0,0,0,0.3);margin:0;line-height:1.5;">
        If you didn't request this email, you can safely ignore it.<br/>
        CEO Lab — Built on the Konstantin Method
      </p>
    </td>
  </tr>
</table>
```

---

## Confirm Signup

**Subject:** `Welcome to CEO Lab — Confirm your email`

**Body:**
```html
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;">
  <tr>
    <td style="padding:48px 32px 24px;text-align:center;">
      <span style="font-size:18px;font-weight:700;color:#000;">nk</span>
      <span style="font-size:18px;font-weight:300;color:#000;margin-left:6px;">CEO Lab</span>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 16px;text-align:center;">
      <h1 style="font-size:24px;font-weight:700;color:#000;margin:0 0 8px;">Welcome to CEO Lab</h1>
      <p style="font-size:14px;color:rgba(0,0,0,0.5);margin:0;line-height:1.6;">
        Confirm your email to start measuring your leadership growth.
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 32px;text-align:center;">
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#000;color:#fff;padding:14px 40px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;">
        Confirm Email
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 48px;text-align:center;">
      <p style="font-size:12px;color:rgba(0,0,0,0.3);margin:0;line-height:1.5;">
        If you didn't create an account, you can safely ignore this.<br/>
        CEO Lab — Built on the Konstantin Method
      </p>
    </td>
  </tr>
</table>
```

---

## Future: Custom SMTP Setup

When CEO Lab domain is ready:

**Option A: Google Workspace SMTP**
- Host: `smtp.gmail.com`
- Port: `465` (SSL) or `587` (TLS)
- Username: `noreply@ceolab.domain`
- Password: App-specific password
- From: `CEO Lab <noreply@ceolab.domain>`

**Option B: Resend**
- Sign up at resend.com
- Verify domain
- Use API key as SMTP password
- Host: `smtp.resend.com`, Port: `465`
