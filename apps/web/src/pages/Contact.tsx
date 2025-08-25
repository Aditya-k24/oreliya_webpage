import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '../config/emailjs';

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current!,
        emailjsConfig.publicKey
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      // Log error for debugging (remove in production)
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header with Logo */}
        <div className='mb-16 text-center'>
          <div className='flex items-center justify-center mb-8'>
            <div className='w-16 h-16 lg:w-20 lg:h-20'>
              <img
                src='/logo-mark.svg'
                alt='Oreliya logo mark'
                className='w-full h-full object-contain dark:hidden'
              />
              <img
                src='/logo-mark-white.svg'
                alt='Oreliya logo mark'
                className='w-full h-full object-contain hidden dark:block'
              />
            </div>
            <div className='h-12 lg:h-16'>
              <img
                src='/logo.svg'
                alt='Oreliya'
                className='h-full w-auto object-contain dark:hidden'
              />
              <img
                src='/logo-white.svg'
                alt='Oreliya'
                className='h-full w-auto object-contain hidden dark:block'
              />
            </div>
          </div>

          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            Contact Us
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
              Get in Touch
            </h2>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#BFA16A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    Address
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    123 Luxury Lane
                    <br />
                    Jewelry District
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#BFA16A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    Phone
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    +1 (555) 123-4567
                    <br />
                    Mon-Fri: 9AM-6PM EST
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#BFA16A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    Email
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    hello@oreliya.com
                    <br />
                    support@oreliya.com
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[#BFA16A] rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    Business Hours
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
              Send us a Message
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  id='name-label'
                >
                  Full Name *
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BFA16A] focus:border-transparent dark:bg-gray-800 dark:text-gray-100 mt-2'
                    placeholder='Enter your full name'
                    aria-labelledby='name-label'
                  />
                </label>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  id='email-label'
                >
                  Email Address *
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BFA16A] focus:border-transparent dark:bg-gray-800 dark:text-gray-100 mt-2'
                    placeholder='Enter your email address'
                    aria-labelledby='email-label'
                  />
                </label>
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  id='subject-label'
                >
                  Subject *
                  <select
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BFA16A] focus:border-transparent dark:bg-gray-800 dark:text-gray-100 mt-2'
                    aria-labelledby='subject-label'
                  >
                    <option value=''>Select a subject</option>
                    <option value='general'>General Inquiry</option>
                    <option value='product'>Product Question</option>
                    <option value='order'>Order Status</option>
                    <option value='return'>Return/Exchange</option>
                    <option value='custom'>Custom Design</option>
                    <option value='other'>Other</option>
                  </select>
                </label>
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                  id='message-label'
                >
                  Message *
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BFA16A] focus:border-transparent dark:bg-gray-800 dark:text-gray-100 mt-2'
                    placeholder='Tell us how we can help you...'
                    aria-labelledby='message-label'
                  />
                </label>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className='p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
                  Thank you for your message! We will get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
                  There was an error sending your message. Please try again or
                  contact us directly.
                </div>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#BFA16A] hover:bg-[#a88c4a]'
                } text-white`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
