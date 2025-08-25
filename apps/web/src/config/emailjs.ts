// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create an account
// 2. Create an Email Service (Gmail, Outlook, etc.)
// 3. Create an Email Template
// 4. Replace the placeholder values below with your actual credentials

export const emailjsConfig = {
  serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
};

// Example EmailJS Template Variables:
// - {{name}} - Sender's name
// - {{email}} - Sender's email
// - {{subject}} - Message subject
// - {{message}} - Message content
// - {{date}} - Submission date
// - {{time}} - Submission time
