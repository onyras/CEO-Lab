# Google OAuth Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Enable Google OAuth in Supabase

1. **Go to Supabase Dashboard** → Your Project
2. **Authentication** → **Providers**
3. Find **Google** in the list
4. Click to expand Google settings

---

### Step 2: Get Google OAuth Credentials

You need to create OAuth credentials in Google Cloud Console:

#### Option A: Use Supabase's Helper (Easiest)

1. In the Google provider settings, Supabase shows:
   - **Redirect URL** (copy this)

2. **Click "Set up Google provider"** link
3. Follow Supabase's guided setup
4. It will help you create the credentials

#### Option B: Manual Setup

1. **Go to:** [Google Cloud Console](https://console.cloud.google.com)
2. **Create a new project** (or select existing)
3. **Enable Google+ API:**
   - APIs & Services → Library
   - Search "Google+ API"
   - Click Enable

4. **Create OAuth Credentials:**
   - APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `CEO Lab`

5. **Add Authorized redirect URIs:**
   ```
   https://xatnfohmnmarllrmpjgt.supabase.co/auth/v1/callback
   ```
   (Get exact URL from Supabase dashboard)

6. **Copy the credentials:**
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxx`

---

### Step 3: Add Credentials to Supabase

1. Back in **Supabase** → **Authentication** → **Providers** → **Google**
2. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
3. **Enable** the provider
4. Click **Save**

---

### Step 4: Test It

1. **Go to:** http://localhost:3000/auth
2. **Click:** "Continue with Google"
3. **Should see:** Google account picker
4. **Select account** → Redirects to dashboard

✅ **Done!**

---

## 🧪 Magic Link Already Works

The email magic link works out of the box - no setup needed!

**Test it:**
1. Go to http://localhost:3000/auth
2. Enter your email
3. Click "Continue with Email"
4. Check inbox → Click link → Logged in

---

## 🚨 Troubleshooting

### Google OAuth shows error
- Check redirect URI matches exactly (trailing slash matters)
- Make sure Google+ API is enabled
- Client ID and Secret are correct

### Magic link not arriving
- Check spam folder
- Check Supabase → Authentication → Settings → SMTP settings
- Default Supabase emails might go to spam

### After clicking Google, nothing happens
- Check browser console for errors
- Make sure cookies are enabled
- Try in incognito mode

---

## 📝 Notes

- **Development:** Google OAuth works on localhost
- **Production:** Add production URL to Google authorized URIs
- **Email confirmations:** Disabled by default for testing (enable in production)

---

**Need help?** Check Supabase docs: https://supabase.com/docs/guides/auth/social-login/auth-google
