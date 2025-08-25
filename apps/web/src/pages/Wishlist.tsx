import { Link } from 'react-router-dom';

export function Wishlist() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            My Wishlist
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Save your favorite items for later
          </p>
        </div>

        {/* Empty State */}
        <div className='text-center py-16'>
          <div className='text-gray-400 dark:text-gray-500 text-6xl mb-4'>
            💝
          </div>
          <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
            Your wishlist is empty
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mb-8'>
            Start adding products to your wishlist while browsing
          </p>
          <Link
            to='/products'
            className='inline-flex items-center px-6 py-3 bg-[#BFA16A] text-white font-medium rounded-lg hover:bg-[#a88c4a] transition-colors'
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
