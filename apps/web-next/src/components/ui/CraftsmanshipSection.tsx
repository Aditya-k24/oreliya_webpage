interface CraftsmanshipSectionProps {
  linkComponent?: React.ComponentType<any>;
}

export function CraftsmanshipSection({
  linkComponent: Link,
}: CraftsmanshipSectionProps) {
  const LinkComponent = Link || 'a';

  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <video
          src='/assets/videos/our-craft.mp4'
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
      </div>
      <div className='relative max-w-7xl mx-auto px-6 lg:px-8 py-24'>
        <div className='max-w-xl'>
          <h3 className='text-3xl md:text-5xl font-bold text-white mb-10'>
            Your story, our craft.
          </h3>
          <div className='flex gap-4'>
            <LinkComponent href='/contact' className='btn-primary'>
              Get in touch
            </LinkComponent>
            <LinkComponent href='/customization' className='btn-white-outline'>
              Create your jewellery
            </LinkComponent>
          </div>
        </div>
      </div>
    </section>
  );
}
