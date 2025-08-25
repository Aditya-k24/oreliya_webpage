import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PriceTag } from '../components/PriceTag';
import { Badge } from '../components/Badge';

export function Cart() {
  const {
    state: cartState,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartState.loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-[#BFA16A]' />
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center py-16'>
            <div className='text-gray-400 dark:text-gray-500 text-6xl mb-4'>
              🛒
            </div>
            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
              Your cart is empty
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-8'>
              Start shopping to add items to your cart
            </p>
            <Link
              to='/products'
              className='inline-flex items-center px-6 py-3 bg-[#BFA16A] text-white font-medium rounded-lg hover:bg-[#a88c4a] transition-colors'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Shopping Cart
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            {cartState.itemCount} item{cartState.itemCount !== 1 ? 's' : ''} in
            your cart
          </p>
        </div>

        {/* Cart Items */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Items List */}
          <div className='lg:col-span-2 space-y-4'>
            {cartState.items.map(item => (
              <div
                key={item.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
              >
                <div className='flex gap-4'>
                  {/* Product Image */}
                  <div className='w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0'>
                    <img
                      src={item.productImage || '/placeholder-product.jpg'}
                      alt={item.productName}
                      className='w-full h-full object-cover'
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/placeholder-product.jpg';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                      {item.productName}
                    </h3>

                    {item.variantSize && (
                      <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                        Size: {item.variantSize}
                      </p>
                    )}

                    {item.variantMaterial && (
                      <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                        Material: {item.variantMaterial}
                      </p>
                    )}

                    {/* Customizations */}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className='mb-2'>
                        {item.customizations.map(custom => (
                          <Badge
                            key={`${item.id}-${custom.name}-${custom.value}`}
                            variant='secondary'
                            className='mr-2 text-xs'
                          >
                            {custom.name}: {custom.value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Quantity Controls */}
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-lg'>
                        <button
                          type='button'
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className='px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                        >
                          -
                        </button>
                        <span className='px-3 py-1 text-gray-900 dark:text-white font-medium'>
                          {item.quantity}
                        </span>
                        <button
                          type='button'
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className='px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                        >
                          +
                        </button>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeFromCart(item.id)}
                        className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium'
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className='text-right'>
                    <PriceTag price={item.price * item.quantity} size='lg' />
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={clearCart}
                className='px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium'
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                Order Summary
              </h2>
              <div className='space-y-3 mb-6'>
                <div className='flex justify-between text-gray-600 dark:text-gray-300'>
                  <span>Subtotal ({cartState.itemCount} items)</span>
                  <span>${cartState.total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-gray-600 dark:text-gray-300'>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className='border-t border-gray-200 dark:border-gray-700 pt-3'>
                  <div className='flex justify-between text-lg font-semibold text-gray-900 dark:text-white'>
                    <span>Total</span>
                    <span>${cartState.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type='button'
                className='w-full px-6 py-3 bg-[#BFA16A] text-white font-medium rounded-lg hover:bg-[#a88c4a] transition-colors mb-4'
              >
                Proceed to Checkout
              </button>

              <Link
                to='/products'
                className='block w-full text-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
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
