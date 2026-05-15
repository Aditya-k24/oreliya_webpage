'use client';

import { useState } from 'react';

interface CustomizationForm {
  customerName: string;
  email: string;
  phone: string;
  jewelryType: string;
  description: string;
  budget: string;
  timeline: string;
  referenceImage: File | null;
  additionalNotes: string;
}

const jewelryTypes = [
  'Ring',
  'Necklace',
  'Earrings',
  'Bracelet',
  'Pendant',
  'Anklet',
  'Brooch',
  'Other',
];
const budgetRanges = [
  'Under ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹2,50,000',
  '₹2,50,000 – ₹5,00,000',
  '₹5,00,000 – ₹10,00,000',
  'Over ₹10,00,000',
];
const timelineOptions = [
  '1–2 weeks',
  '3–4 weeks',
  '1–2 months',
  '2–3 months',
  '3+ months',
  'No specific timeline',
];

const inputCls =
  'w-full bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none py-2.5 text-[#1E240A] text-sm tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/20';
const labelCls =
  'block text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/45 mb-2';
const selectCls = `${inputCls} cursor-pointer`;

export default function CustomizationPage() {
  const [formData, setFormData] = useState<CustomizationForm>({
    customerName: '',
    email: '',
    phone: '',
    jewelryType: '',
    description: '',
    budget: '',
    timeline: '',
    referenceImage: null,
    additionalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, referenceImage: file }));
      const reader = new FileReader();
      reader.onload = event => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          productType: formData.jewelryType,
          customizationDetails: formData.description,
          budget: formData.budget,
          deliveryDate: formData.timeline,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            customerName: '',
            email: '',
            phone: '',
            jewelryType: '',
            description: '',
            budget: '',
            timeline: '',
            referenceImage: null,
            additionalNotes: '',
          });
          setImagePreview(null);
        }, 4000);
      } else {
        alert(data.message || 'Failed to send request. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className='min-h-screen bg-[#F6EEDF] flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-6'>
            Request Received
          </p>
          <h1
            className='text-4xl text-[#1E240A] mb-5'
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Thank you.
          </h1>
          <p className='text-[#1E240A]/50 text-sm font-light'>
            Our team will get back to you within 24–48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#F6EEDF]'>
      <div className='max-w-3xl mx-auto px-6 lg:px-8 py-16'>
        {/* Banner */}
        <div className='text-center mb-14 pb-14 border-b border-[#1E240A]/10'>
          <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-6'>
            Bespoke
          </p>
          <h1
            className='text-5xl md:text-6xl text-[#1E240A] leading-[1.0] mb-6'
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Custom Jewellery
            <br />
            <span className='italic'>Design</span>
          </h1>
          <p className='text-[#1E240A]/50 text-sm font-light max-w-md mx-auto leading-relaxed'>
            Bring your vision to life. Upload a reference image and let us
            create something uniquely yours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <label htmlFor='customerName' className={labelCls}>
                Full Name *
              </label>
              <input
                type='text'
                id='customerName'
                name='customerName'
                required
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder='Your name'
                className={inputCls}
              />
            </div>
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
                onChange={handleInputChange}
                placeholder='your@email.com'
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor='phone' className={labelCls}>
              Phone Number
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              placeholder='+91 00000 00000'
              className={inputCls}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <label htmlFor='jewelryType' className={labelCls}>
                Type of Jewellery *
              </label>
              <select
                id='jewelryType'
                name='jewelryType'
                required
                value={formData.jewelryType}
                onChange={handleInputChange}
                className={selectCls}
              >
                <option value=''>Select type</option>
                {jewelryTypes.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor='budget' className={labelCls}>
                Budget Range *
              </label>
              <select
                id='budget'
                name='budget'
                required
                value={formData.budget}
                onChange={handleInputChange}
                className={selectCls}
              >
                <option value=''>Select range</option>
                {budgetRanges.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor='timeline' className={labelCls}>
              Timeline *
            </label>
            <select
              id='timeline'
              name='timeline'
              required
              value={formData.timeline}
              onChange={handleInputChange}
              className={selectCls}
            >
              <option value=''>Select timeline</option>
              {timelineOptions.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='description' className={labelCls}>
              Describe Your Vision *
            </label>
            <textarea
              id='description'
              name='description'
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Style, materials, occasion, any specific details…'
              className='w-full bg-transparent border border-[#1E240A]/15 focus:border-[#1E240A]/40 outline-none p-4 text-[#1E240A] text-sm font-light leading-relaxed tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25 resize-none'
            />
          </div>

          {/* Image upload */}
          <div>
            <label className={labelCls}>Reference Image *</label>
            <div className='border border-dashed border-[#1E240A]/20 hover:border-[#1E240A]/40 transition-colors p-8'>
              {imagePreview ? (
                <div className='flex items-center gap-6'>
                  <img
                    src={imagePreview}
                    alt='Reference'
                    className='w-20 h-20 object-cover flex-shrink-0'
                  />
                  <div>
                    <p className='text-[#1E240A]/60 text-xs mb-3'>
                      {formData.referenceImage?.name}
                    </p>
                    <button
                      type='button'
                      onClick={() => {
                        setFormData(p => ({ ...p, referenceImage: null }));
                        setImagePreview(null);
                      }}
                      className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/30 hover:text-[#1E240A] transition-colors'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor='referenceImage'
                  className='flex flex-col items-center gap-3 cursor-pointer'
                >
                  <svg
                    className='w-8 h-8 text-[#1E240A]/20'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1}
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <span className='text-[#1E240A]/40 text-xs tracking-wide'>
                    Click to upload · PNG, JPG up to 10MB
                  </span>
                  <input
                    id='referenceImage'
                    name='referenceImage'
                    type='file'
                    accept='image/*'
                    required
                    onChange={handleImageChange}
                    className='sr-only'
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label htmlFor='additionalNotes' className={labelCls}>
              Additional Notes
            </label>
            <textarea
              id='additionalNotes'
              name='additionalNotes'
              rows={3}
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder='Any other preferences or special requests…'
              className='w-full bg-transparent border border-[#1E240A]/15 focus:border-[#1E240A]/40 outline-none p-4 text-[#1E240A] text-sm font-light leading-relaxed tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25 resize-none'
            />
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Submitting…' : 'Submit Design Request'}
            </button>
          </div>
        </form>

        {/* How it works */}
        <div className='mt-20 pt-16 border-t border-[#1E240A]/10'>
          <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-10'>
            How It Works
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#1E240A]/10'>
            {[
              {
                n: '01',
                title: 'Submit Your Request',
                body: 'Upload a reference image and fill out the form with your vision.',
              },
              {
                n: '02',
                title: 'Design Consultation',
                body: 'Our team reviews and discusses every detail with you directly.',
              },
              {
                n: '03',
                title: 'Creation & Delivery',
                body: 'We handcraft your piece and deliver it with care.',
              },
            ].map(step => (
              <div
                key={step.n}
                className='py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0'
              >
                <p className='text-[#1E240A]/25 text-[9px] uppercase tracking-widest mb-4'>
                  {step.n}
                </p>
                <p className='text-[#1E240A] text-sm mb-2'>{step.title}</p>
                <p className='text-[#1E240A]/45 text-xs font-light leading-relaxed'>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
