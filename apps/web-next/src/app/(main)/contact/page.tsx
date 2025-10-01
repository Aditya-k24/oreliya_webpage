'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get('product');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    product: productParam || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Update form data when product param changes
  useEffect(() => {
    if (productParam) {
      setFormData(prev => ({ ...prev, product: productParam }));
    }
  }, [productParam]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          product: '',
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-white'>
      <div className='bg-[#F6EEDF] py-20'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8 text-center'>
          <div className='mb-8'>
            <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center'>
              <span className='text-white text-2xl'>💌</span>
            </div>
            <h1 className='text-5xl md:text-6xl font-light text-[#1E240A] mb-6 tracking-tight leading-tight'>
              Get in Touch
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              We&apos;d love to hear from you. Whether you have a question about
              our collection or need assistance with a custom design, we&apos;re
              here to help.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          <div className='space-y-8'>
            <div>
              <h2 className='text-3xl font-light text-[#1E240A] mb-6'>
                Let&apos;s Connect
              </h2>
              <p className='text-lg text-gray-600 leading-relaxed'>
                Our team is ready to assist you with any questions about our
                jewelry collection or custom design services.
              </p>
            </div>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#1E240A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-[#1E240A] mb-2'>
                    Visit Our Studio
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    Borivali & Bhayandar
                    <br />
                    Mumbai, India
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#1E240A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-[#1E240A] mb-2'>
                    Email Us
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    palak.oreliya@gmail.com
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#1E240A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-[#1E240A] mb-2'>
                    Call Us
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    +91 8433845198
                    <br />
                    Mon-Fri: 9AM-6PM IST
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#1E240A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-[#1E240A] mb-2'>
                    Follow Us
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    Instagram: @oreliya.in
                    <br />
                    Stay updated with our latest designs
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#1E240A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-[#1E240A] mb-2'>
                    Meet Our Founder
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    Palak Nagori
                    <br />
                    Founder & Creative Director
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-[#F6EEDF] p-8 rounded-2xl'>
            <h3 className='text-2xl font-medium text-[#1E240A] mb-6'>
              Send Us a Message
            </h3>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
                <div className='flex items-center'>
                  <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                <div className='flex items-center'>
                  <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                  </svg>
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              {formData.product && (
                <div className='p-4 bg-[#1E240A]/10 rounded-lg'>
                  <p className='text-sm font-medium text-[#1E240A] mb-1'>Product Inquiry</p>
                  <p className='text-gray-700'>{formData.product}</p>
                </div>
              )}
              
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Full Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border-b border-gray-300 focus:border-[#1E240A] focus:outline-none bg-transparent text-gray-900 placeholder-gray-500 transition-colors duration-300'
                  placeholder='Enter your full name'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Email Address *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border-b border-gray-300 focus:border-[#1E240A] focus:outline-none bg-transparent text-gray-900 placeholder-gray-500 transition-colors duration-300'
                  placeholder='Enter your email address'
                />
              </div>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border-b border-gray-300 focus:border-[#1E240A] focus:outline-none bg-transparent text-gray-900 placeholder-gray-500 transition-colors duration-300'
                  placeholder='+91 XXXXX XXXXX'
                />
              </div>
              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Subject *
                </label>
                <select
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border-b border-gray-300 focus:border-[#1E240A] focus:outline-none bg-transparent text-gray-900'
                >
                  <option value=''>Select a subject</option>
                  <option value='general'>General Inquiry</option>
                  <option value='custom'>Custom Design</option>
                  <option value='support'>Customer Support</option>
                  <option value='wholesale'>Wholesale Inquiry</option>
                  <option value='other'>Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Message *
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className='w-full px-4 py-3 border-b border-gray-300 focus:border-[#1E240A] focus:outline-none bg-transparent text-gray-900 placeholder-gray-500 transition-colors duration-300 resize-none'
                  placeholder='Tell us how we can help you...'
                />
              </div>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full py-4 px-6 font-medium rounded border border-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : submitStatus === 'success'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-[#1E240A] text-white hover:bg-white hover:text-[#1E240A]'
                }`}
              >
                {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className='bg-white min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E240A] mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}
