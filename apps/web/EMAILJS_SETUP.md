# EmailJS Setup Guide

To make the contact form actually send emails, you need to set up EmailJS:

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Design your email template using these variables:
   - `{{name}}` - Sender's name
   - `{{email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{date}}` - Submission date
   - `{{time}}` - Submission time
4. Save the template and note down your **Template ID**

## Step 4: Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

## Step 5: Update Configuration
1. Open `src/config/emailjs.ts`
2. Replace the placeholder values:
   ```typescript
   export const emailjsConfig = {
     serviceId: 'your_actual_service_id',
     templateId: 'your_actual_template_id',
     publicKey: 'your_actual_public_key',
   };
   ```

## Step 6: Test
1. Fill out the contact form
2. Submit and check if you receive the email
3. Check the browser console for any errors

## Free Tier Limits
- EmailJS free tier allows 200 emails per month
- Perfect for small to medium websites
- Upgrade plans available for higher volumes

## Troubleshooting
- Make sure all IDs are correct
- Check browser console for error messages
- Verify your email service is properly connected
- Ensure your template variables match the form field names 