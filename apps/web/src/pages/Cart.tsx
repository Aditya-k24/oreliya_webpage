import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Elegant Diamond Ring',
      price: 2500,
      quantity: 1,
      image: '/images/ring-1.jpg',
    },
    {
      id: 2,
      name: 'Classic Pearl Necklace',
      price: 1200,
      quantity: 1,
      image: '/images/necklace-1.jpg',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-[#1E240A]' />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className='bg-white min-h-screen'>
        {/* Empty Cart Hero */}
        <div className='bg-[#F6EEDF] py-20'>
          <div className='max-w-4xl mx-auto px-6 lg:px-8 text-center'>
            <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center'>
              <span className='text-white text-2xl'>🛒</span>
            </div>
            <h1 className='text-4xl font-light text-[#1E240A] mb-4'>
              Your Cart is Empty
            </h1>
            <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
              Discover our beautiful collection and find the perfect piece that
              speaks to your soul.
            </p>
            <Link
              to='/products'
              className='inline-flex items-center px-8 py-4 bg-[#1E240A] text-white font-medium rounded-none border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Cart Header */}
      <div className='bg-[#F6EEDF] py-16'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <h1 className='text-4xl font-light text-[#1E240A] text-center'>
            Shopping Cart
          </h1>
          <p className='text-lg text-gray-600 text-center mt-4'>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your
            cart
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='space-y-6'>
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className='flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-lg'
                >
                  {/* Item Image */}
                  <div className='w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <span className='text-2xl'>💎</span>
                  </div>

                  {/* Item Details */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg font-medium text-[#1E240A] mb-2'>
                      {item.name}
                    </h3>
                    <p className='text-gray-600'>
                      ${item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className='w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-[#1E240A] transition-colors'
                    >
                      <span className='text-gray-600 hover:text-[#1E240A]'>
                        −
                      </span>
                    </button>
                    <span className='w-12 text-center text-gray-900'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className='w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-[#1E240A] transition-colors'
                    >
                      <span className='text-gray-600 hover:text-[#1E240A]'>
                        +
                      </span>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className='text-right min-w-0'>
                    <p className='text-lg font-medium text-[#1E240A]'>
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className='text-gray-400 hover:text-red-500 transition-colors p-2'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-[#F6EEDF] p-8 rounded-2xl sticky top-24'>
              <h2 className='text-2xl font-medium text-[#1E240A] mb-6'>
                Order Summary
              </h2>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span className='text-[#1E240A] font-medium'>Free</span>
                </div>
                <div className='border-t border-gray-300 pt-4'>
                  <div className='flex justify-between text-xl font-medium text-[#1E240A]'>
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type='button'
                className='w-full px-6 py-4 bg-[#1E240A] text-white font-medium rounded-none border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 mb-4 uppercase tracking-wider text-sm'
              >
                Proceed to Checkout
              </button>

              <Link
                to='/products'
                className='block text-center text-[#1E240A] hover:text-[#2A3A1A] transition-colors text-sm uppercase tracking-wider'
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
