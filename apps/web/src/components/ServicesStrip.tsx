const services = [
  { title: 'Worldwide express shipping', icon: '✈️' },
  { title: 'Free resizing', icon: '📏' },
  { title: 'Lifetime warranty', icon: '🔒' },
  { title: 'Bespoke customization', icon: '💎' },
];

export function ServicesStrip() {
  return (
    <section className='bg-white dark:bg-gray-950 border-t border-b border-gray-200/60 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6'>
        {services.map(s => (
          <div
            key={s.title}
            className='flex items-center gap-3 text-gray-800 dark:text-gray-100'
          >
            <span className='text-2xl'>{s.icon}</span>
            <span className='text-sm font-medium'>{s.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
