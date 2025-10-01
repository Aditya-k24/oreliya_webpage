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
    'Under $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    'Over $10,000',
  ];
  const timelineOptions = [
    '1-2 weeks',
    '3-4 weeks',
    '1-2 months',
    '2-3 months',
    '3+ months',
    'No specific timeline',
  ];

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
      // Send customization request
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        }, 3000);
      } else {
        alert(data.message || 'Failed to send customization request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting customization:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='max-w-md mx-auto text-center p-8'>
          <div className='text-6xl mb-4'>✨</div>
          <h1 className='text-3xl font-bold text-[#1E240A] mb-4'>
            Request Submitted!
          </h1>
          <p className='text-gray-600 mb-6'>
            Thank you for your customization request. Our team will review your
            reference image and get back to you within 24-48 hours.
          </p>
          <div className='text-sm text-gray-500'>
            You&apos;ll receive a confirmation email shortly.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 text-center bg-[#F6EEDF] py-12 rounded-2xl'>
          <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center'>
            <span className='text-white text-2xl'>💎</span>
          </div>
          <h1 className='text-4xl font-bold text-[#1E240A] mb-4'>
            Custom Jewelry Design
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Bring your vision to life with our bespoke jewelry service. Upload a
            reference image and let us create something uniquely yours.
          </p>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl shadow-lg p-6 lg:p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='customerName'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Full Name *
                </label>
                <input
                  type='text'
                  id='customerName'
                  name='customerName'
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border-b border-gray-300 focus:border-[#1E240A] bg-transparent outline-none transition-colors'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Email *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border-b border-gray-300 focus:border-[#1E240A] bg-transparent outline-none transition-colors'
                />
              </div>
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
                onChange={handleInputChange}
                className='w-full px-3 py-2 border-b border-gray-300 focus:border-[#1E240A] bg-transparent outline-none transition-colors'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='jewelryType'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Type of Jewelry *
                </label>
                <select
                  id='jewelryType'
                  name='jewelryType'
                  required
                  value={formData.jewelryType}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border-b border-gray-300 focus:border-[#1E240A] bg-transparent outline-none transition-colors'
                >
                  <option value=''>Select jewelry type</option>
                  {jewelryTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor='budget'
                  className='block text-sm font-medium text-[#1E240A] mb-2'
                >
                  Budget Range *
                </label>
                <select
                  id='budget'
                  name='budget'
                  required
                  value={formData.budget}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border-b border-gray-300 focus:border-[#1E240A] bg-transparent outline-none transition-colors'
                >
                  <option value=''>Select budget range</option>
                  {budgetRanges.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor='timeline'
                className='block text-sm font-medium text-[#1E240A] mb-2'
              >
                Timeline *
              </label>
              <select
                id='timeline'
                name='timeline'
                required
                value={formData.timeline}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border-b border-gray-300 focus:border-[#1E240A] bg-transparent outline-none transition-colors'
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
              <label
                htmlFor='description'
                className='block text-sm font-medium text-[#1E240A] mb-2'
              >
                Description of Your Vision *
              </label>
              <textarea
                id='description'
                name='description'
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Describe the jewelry piece you have in mind, including style, materials, and any specific details...'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#1E240A] outline-none transition-colors resize-none'
              />
            </div>

            <div>
              <label
                htmlFor='referenceImage'
                className='block text-sm font-medium text-[#1E240A] mb-2'
              >
                Reference Image *
              </label>
              <div className='mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#1E240A] transition-colors'>
                <div className='space-y-1 text-center'>
                  {imagePreview ? (
                    <div className='space-y-4'>
                      <img
                        src={imagePreview}
                        alt='Reference preview'
                        className='mx-auto h-32 w-32 object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            referenceImage: null,
                          }));
                          setImagePreview(null);
                        }}
                        className='text-sm text-red-600 hover:text-red-500'
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <div className='flex text-sm text-gray-600'>
                        <label
                          htmlFor='referenceImage'
                          className='relative cursor-pointer bg-white rounded-md font-medium text-[#1E240A] hover:text-[#2A3A1A]'
                        >
                          <span>Upload a file</span>
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
                        <p className='pl-1'>or drag and drop</p>
                      </div>
                      <p className='text-xs text-gray-500'>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor='additionalNotes'
                className='block text-sm font-medium text-[#1E240A] mb-2'
              >
                Additional Notes
              </label>
              <textarea
                id='additionalNotes'
                name='additionalNotes'
                rows={3}
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder='Any other details, preferences, or special requests...'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#1E240A] outline-none transition-colors resize-none'
              />
            </div>

            <div className='pt-4'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-[#1E240A] hover:bg-[#2A3A1A] text-white font-medium py-3 px-4 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wider text-sm rounded'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2' />
                    Submitting...
                  </>
                ) : (
                  'Submit Customization Request'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className='mt-8 bg-[#F6EEDF] rounded-2xl p-6'>
          <h3 className='text-lg font-semibold text-[#1E240A] mb-4'>
            How It Works
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white text-xl'>1</span>
              </div>
              <h4 className='font-medium text-[#1E240A] mb-2'>
                Submit Your Request
              </h4>
              <p className='text-sm text-gray-600'>
                Upload a reference image and fill out our detailed form
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white text-xl'>2</span>
              </div>
              <h4 className='font-medium text-[#1E240A] mb-2'>
                Design Consultation
              </h4>
              <p className='text-sm text-gray-600'>
                Our team will review and discuss your vision with you
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-white text-xl'>3</span>
              </div>
              <h4 className='font-medium text-[#1E240A] mb-2'>
                Creation &amp; Delivery
              </h4>
              <p className='text-sm text-gray-600'>
                We&apos;ll craft your custom piece and deliver it to you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
