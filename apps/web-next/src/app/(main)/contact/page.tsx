'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const inputCls =
  'w-full bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none py-3 text-[#1E240A] text-sm tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25';
const labelCls =
  'block text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/40 mb-2';

const contactDetails = [
  { label: 'Studio', value: 'Bhayandar, Mumbai, India' },
  { label: 'Email', value: 'palak.oreliya@gmail.com' },
  { label: 'Phone', value: '+91 8433845198', note: 'Mon–Fri, 9AM–6PM IST' },
  { label: 'Instagram', value: '@oreliya.in' },
  { label: 'Founder', value: 'Palak Nagori', note: 'Creative Director' },
];

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
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (productParam) setFormData(prev => ({ ...prev, product: productParam }));
  }, [productParam]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  let btnLabel = 'Send Message';
  if (isSubmitting) btnLabel = 'Sending…';
  else if (submitStatus === 'success') btnLabel = 'Message Sent';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitStatus('success');
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
        setErrorMessage(
          data.message || 'Failed to send message. Please try again.'
        );
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-[#F6EEDF] min-h-screen'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
        {/* Header */}
        <div className='mb-16 pb-16 border-b border-[#1E240A]/10'>
          <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-6'>
            Contact
          </p>
          <h1
            className='text-5xl md:text-6xl text-[#1E240A] leading-[0.95]'
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Get in Touch
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24'>
          {/* Left — contact info */}
          <div>
            <p className='text-[#1E240A]/55 text-sm font-light leading-relaxed mb-12 max-w-sm'>
              Whether you have a question about our collection or need
              assistance with a custom design — we&apos;re here.
            </p>

            <div className='divide-y divide-[#1E240A]/10'>
              {contactDetails.map(item => (
                <div
                  key={item.label}
                  className='py-5 flex items-start justify-between gap-8'
                >
                  <span className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/35 pt-0.5 flex-shrink-0 w-20'>
                    {item.label}
                  </span>
                  <div className='text-right'>
                    <p className='text-[#1E240A] text-sm'>{item.value}</p>
                    {item.note && (
                      <p className='text-[#1E240A]/40 text-xs mt-0.5'>
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {formData.product && (
              <div className='mb-8 pb-4 border-b border-[#1E240A]/15'>
                <p className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/35 mb-1'>
                  Enquiring about
                </p>
                <p className='text-[#1E240A] text-sm'>{formData.product}</p>
              </div>
            )}

            {submitStatus === 'success' && (
              <div className='mb-8 pb-4 border-b border-[#1E240A]/15'>
                <p className='text-[#1E240A] text-sm'>
                  Message sent. We&apos;ll be in touch soon.
                </p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className='mb-8 pb-4 border-b border-[#1E240A]/15'>
                <p className='text-[#1E240A]/60 text-sm'>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-8'>
              <div>
                <label htmlFor='name' className={labelCls}>
                  Full Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your name'
                  className={inputCls}
                />
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <div>
                  <label htmlFor='email' className={labelCls}>
                    Email *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='your@email.com'
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor='phone' className={labelCls}>
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='+91 00000 00000'
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='subject' className={labelCls}>
                  Subject *
                </label>
                <select
                  id='subject'
                  name='subject'
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputCls}
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
                <label htmlFor='message' className={labelCls}>
                  Message *
                </label>
                <textarea
                  id='message'
                  name='message'
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='How can we help you?'
                  className='w-full bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none pt-1 pb-3 text-[#1E240A] text-sm font-light leading-relaxed tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25 resize-none'
                />
              </div>

              <div className='pt-2'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {btnLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className='bg-[#F6EEDF] min-h-screen flex items-center justify-center'>
          <div className='w-px h-12 bg-[#1E240A]/20' />
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
}
