import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    // Handle form submission logic here
  };

  return (
    <div className='bg-white'>
      {/* Hero Section */}
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
              We'd love to hear from you. Whether you have a question about our
              collection or need assistance with a custom design, we're here to
              help.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-3xl font-light text-[#1E240A] mb-6'>
                Let's Connect
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
                    123 Luxury Lane
                    <br />
                    Jewelry District
                    <br />
                    New York, NY 10001
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
                    hello@oreliya.com
                    <br />
                    custom@oreliya.com
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
                    +1 (555) 123-4567
                    <br />
                    Mon-Fri: 9AM-6PM EST
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
                    Response Time
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    We typically respond within
                    <br />
                    24 hours during business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-[#F6EEDF] p-8 rounded-2xl'>
            <h3 className='text-2xl font-medium text-[#1E240A] mb-6'>
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className='space-y-6'>
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
                className={`w-full py-4 px-6 font-medium rounded-none border border-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#1E240A] text-white hover:bg-white hover:text-[#1E240A]'
                }`}
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
