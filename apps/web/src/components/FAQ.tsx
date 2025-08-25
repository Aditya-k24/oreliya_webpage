import { useState } from 'react';

const faqs = [
  {
    q: 'How long will it take to get my order?',
    a: 'Most items ship within 5–7 business days. Custom pieces vary depending on design complexity.',
  },
  {
    q: 'Do you ship worldwide?',
    a: 'Yes, we offer insured express shipping to most countries.',
  },
  {
    q: 'Are lab grown diamonds a simulant or real?',
    a: 'Lab grown diamonds are chemically and physically identical to mined diamonds—just created in a lab.',
  },
  {
    q: 'What ring shapes do you offer?',
    a: 'Round, oval, emerald, cushion, pear, princess and more.',
  },
  {
    q: 'Difference between a mined and ethical lab grown diamond?',
    a: 'Primarily origin and environmental impact. Both offer exceptional brilliance and durability.',
  },
  {
    q: 'How do you ensure a seamless purchase?',
    a: 'Dedicated stylists, transparent pricing, secure checkout and lifetime care.',
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className='bg-white dark:bg-gray-900 py-16'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-10'>
          <h3 className='text-3xl font-bold text-gray-900 dark:text-white'>
            FAQ
          </h3>
          <p className='text-gray-600 dark:text-gray-300'>
            Your questions, answered.
          </p>
        </div>
        <div className='divide-y divide-gray-200/70 dark:divide-gray-800 rounded-2xl border border-gray-200/70 dark:border-gray-800 overflow-hidden'>
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q}>
                <button
                  type='button'
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className='w-full flex items-center justify-between text-left px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                  aria-expanded={isOpen}
                >
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {item.q}
                  </span>
                  <span className='text-gray-500'>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className='px-5 pb-5 text-gray-700 dark:text-gray-300'>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
