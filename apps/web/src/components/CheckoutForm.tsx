import React from 'react';
// NOTE: Make sure to install @stripe/react-stripe-js and @stripe/stripe-js in your project.
// pnpm add @stripe/react-stripe-js @stripe/stripe-js
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;
    // Replace with your payment intent logic
    // const {error, paymentIntent} = await stripe.confirmCardPayment(...)
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <span className='block mb-2 text-sm font-medium text-gray-700'>
          Card Details
        </span>
        <div className='p-3 border rounded bg-white dark:bg-gray-900'>
          <CardElement
            aria-label='Card Details'
            options={{
              style: {
                base: { fontSize: '16px', color: '#222', fontFamily: 'serif' },
              },
            }}
          />
        </div>
      </div>
      {error && <div className='text-red-600 text-sm'>{error}</div>}
      <button
        type='submit'
        disabled={loading || !stripe}
        className='w-full bg-[#BFA16A] text-white py-2 rounded font-semibold hover:bg-[#a88c4a] transition'
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
