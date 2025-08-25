import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Account() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Please log in to access your account
          </h2>
          <Link
            to='/login'
            className='px-6 py-3 bg-[#BFA16A] text-white font-medium rounded-lg hover:bg-[#a88c4a] transition-colors'
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            My Account
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Welcome back, {user.firstName}!
          </p>
        </div>

        {/* Account Sections */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Profile Section */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Profile Information
            </h2>
            <div className='space-y-4'>
              <div>
                <span className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Name
                </span>
                <p className='text-gray-900 dark:text-white'>
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <span className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Email
                </span>
                <p className='text-gray-900 dark:text-white'>{user.email}</p>
              </div>
              <div>
                <span className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Role
                </span>
                <p className='text-gray-900 dark:text-white capitalize'>
                  {user.role?.name || 'Customer'}
                </p>
              </div>
            </div>
            <button
              type='button'
              className='mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Quick Actions
            </h2>
            <div className='space-y-3'>
              <Link
                to='/orders'
                className='block w-full px-4 py-3 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                View Orders
              </Link>
              <Link
                to='/wishlist'
                className='block w-full px-4 py-3 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                My Wishlist
              </Link>
              <Link
                to='/cart'
                className='block w-full px-4 py-3 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:col-span-2'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Recent Activity
            </h2>
            <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
              <div className='text-4xl mb-2'>📊</div>
              <p>No recent activity to display</p>
              <p className='text-sm'>
                Start shopping to see your activity here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
