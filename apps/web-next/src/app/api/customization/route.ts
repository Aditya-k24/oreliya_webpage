import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_jQvxW3sn_32Pi2ypsU1sMXPQx8ARxmM5y');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, productType, customizationDetails, budget, deliveryDate } = body;

    // Validate required fields
    if (!name || !email || !productType || !customizationDetails) {
      return NextResponse.json(
        { success: false, message: 'Name, email, product type, and customization details are required' },
        { status: 400 }
      );
    }

    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: 'Oreliya Customization <onboarding@resend.dev>',
      to: 'kulkarni24aditya@gmail.com',
      subject: `New Customization Request: ${productType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E240A; border-bottom: 2px solid #1E240A; padding-bottom: 10px;">
            Customization Request
          </h2>
          
          <div style="background: #F6EEDF; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1E240A;">Product Type: ${productType}</h3>
          </div>
          
          <div style="margin: 20px 0;">
            <h4 style="color: #1E240A;">Customer Information</h4>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #1E240A;">Customization Details</h4>
            <p style="white-space: pre-wrap;">${customizationDetails}</p>
          </div>
          
          ${budget ? `
            <div style="margin: 20px 0;">
              <p><strong>Budget:</strong> ₹${budget}</p>
            </div>
          ` : ''}
          
          ${deliveryDate ? `
            <div style="margin: 20px 0;">
              <p><strong>Desired Delivery Date:</strong> ${new Date(deliveryDate).toLocaleDateString('en-IN')}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the Oreliya website customization form.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Customization request sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending customization email:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

