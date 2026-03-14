export default function ProductLoading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#F6EEDF] to-[#F0E6D2]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb skeleton */}
        <div className='mb-8 flex items-center space-x-2'>
          <div className='h-4 w-10 bg-[#1E240A]/10 rounded animate-pulse' />
          <div className='h-4 w-2 bg-[#1E240A]/10 rounded animate-pulse' />
          <div className='h-4 w-16 bg-[#1E240A]/10 rounded animate-pulse' />
          <div className='h-4 w-2 bg-[#1E240A]/10 rounded animate-pulse' />
          <div className='h-4 w-32 bg-[#1E240A]/10 rounded animate-pulse' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Image carousel skeleton */}
          <div className='space-y-4'>
            <div className='w-full aspect-square rounded-2xl bg-[#1E240A]/10 animate-pulse' />
            <div className='flex gap-3'>
              {['t1', 't2', 't3', 't4'].map(k => (
                <div
                  key={k}
                  className='w-20 h-20 rounded-xl bg-[#1E240A]/10 animate-pulse'
                />
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className='space-y-8'>
            {/* Badge + title */}
            <div className='space-y-4'>
              <div className='h-6 w-24 bg-[#1E240A]/10 rounded-full animate-pulse' />
              <div className='space-y-2'>
                <div className='h-10 w-3/4 bg-[#1E240A]/10 rounded animate-pulse' />
                <div className='h-10 w-1/2 bg-[#1E240A]/10 rounded animate-pulse' />
              </div>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <div className='h-4 w-full bg-[#1E240A]/10 rounded animate-pulse' />
              <div className='h-4 w-full bg-[#1E240A]/10 rounded animate-pulse' />
              <div className='h-4 w-5/6 bg-[#1E240A]/10 rounded animate-pulse' />
              <div className='h-4 w-4/6 bg-[#1E240A]/10 rounded animate-pulse' />
            </div>

            {/* CTA button */}
            <div className='h-14 w-full bg-[#1E240A]/20 rounded-2xl animate-pulse' />

            {/* Features card */}
            <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-3'>
              <div className='h-5 w-36 bg-gray-200 rounded animate-pulse' />
              {['f1', 'f2', 'f3', 'f4'].map(k => (
                <div key={k} className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-gray-200 rounded-full animate-pulse' />
                  <div className='h-4 w-56 bg-gray-200 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
