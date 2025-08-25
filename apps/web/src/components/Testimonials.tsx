const testimonials = [
  {
    name: 'Ava K.',
    text: 'Exquisite craftsmanship and outstanding service. My ring is perfect!',
  },
  {
    name: 'Liam B.',
    text: 'The consultation was seamless and the final piece exceeded expectations.',
  },
  {
    name: 'Sophia R.',
    text: 'Beautiful designs and fast delivery. Highly recommended.',
  },
];

export function Testimonials() {
  return (
    <section className='py-16 bg-gray-50 dark:bg-gray-950'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <h3 className='text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10'>
          What our clients say
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {testimonials.map(t => (
            <div
              key={t.name}
              className='rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg transition-shadow'
            >
              <div className='flex items-center gap-2 text-[#BFA16A] mb-3'>
                ★★★★★
              </div>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.text}</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
