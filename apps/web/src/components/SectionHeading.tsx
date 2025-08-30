export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className='text-center mb-10'>
      <h2 className='text-[28px] md:text-[34px] tracking-tight font-semibold text-[#1E240A]'>
        {title}
      </h2>
      {subtitle && <p className='mt-2 text-gray-600'>{subtitle}</p>}
    </div>
  );
}
