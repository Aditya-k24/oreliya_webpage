import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_development');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Oreliya Contact Form <contact@oreliya.com>',
      to: ['palak.oreliya@gmail.com'],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #F6EEDF; padding: 20px; text-align: center;">
            <h1 style="color: #1E240A; margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1E240A; margin-bottom: 5px;">From:</h3>
              <p style="margin: 0; color: #666;">${name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1E240A; margin-bottom: 5px;">Email:</h3>
              <p style="margin: 0; color: #666;">${email}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1E240A; margin-bottom: 5px;">Subject:</h3>
              <p style="margin: 0; color: #666;">${subject}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1E240A; margin-bottom: 5px;">Message:</h3>
              <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: #1E240A; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">
              This message was sent from the Oreliya website contact form.
            </p>
          </div>
        </div>
      `,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Email sent successfully',
        id: data?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 