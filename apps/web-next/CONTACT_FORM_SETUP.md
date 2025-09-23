# Contact Form Setup Guide

This branch implements a functional contact form using Resend for email delivery.

## Features

- ✅ Form validation (client-side and server-side)
- ✅ Email delivery via Resend API
- ✅ User feedback (success/error messages)
- ✅ Form reset on successful submission
- ✅ Professional email template
- ✅ Reply-to functionality

## Setup Instructions

### 1. Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual Resend API key:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 3. Domain Configuration (Optional)

For production, you'll need to:
1. Add your domain to Resend dashboard
2. Update the `from` email in `/src/app/api/contact/route.ts`
3. Verify your domain in Resend

## How It Works

### API Route
- **File**: `/src/app/api/contact/route.ts`
- **Method**: POST
- **Validates**: Required fields, email format
- **Sends**: HTML email to `palak.oreliya@gmail.com`
- **Reply-to**: Customer's email address

### Contact Form
- **File**: `/src/app/(main)/contact/page.tsx`
- **Features**: Real-time validation, success/error states
- **Resets**: Form clears on successful submission

### Email Template
- Professional HTML template with Oreliya branding
- Includes all form fields (name, email, subject, message)
- Responsive design with brand colors

## Testing

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/contact`
3. Fill out and submit the form
4. Check the configured email address for delivery

## Production Deployment

1. Add environment variables to your hosting platform
2. Update the `from` email domain to match your verified domain
3. Test thoroughly before going live

## Troubleshooting

### Common Issues

1. **"Failed to send email"**
   - Check API key is correct
   - Verify Resend account is active
   - Check domain verification (if using custom domain)

2. **Network errors**
   - Check internet connection
   - Verify API endpoint is accessible

3. **Email not received**
   - Check spam folder
   - Verify recipient email is correct
   - Check Resend dashboard for delivery status

### Debug Mode

Add console logging to the API route for debugging:
```typescript
console.log('Form data:', { name, email, subject, message });
console.log('Resend response:', { data, error });
```

## Security Notes

- API key is server-side only (not exposed to client)
- Form includes CSRF protection via Next.js
- Input validation on both client and server
- Rate limiting should be added for production use 