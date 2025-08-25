interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceTag({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
}: PriceTagProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isOnSale = compareAtPrice && compareAtPrice > price;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`font-bold text-gray-900 dark:text-white ${sizeClasses[size]}`}
      >
        {formatPrice(price)}
      </span>

      {isOnSale && (
        <>
          <span
            className={`line-through text-gray-500 dark:text-gray-400 ${sizeClasses[size]}`}
          >
            {formatPrice(compareAtPrice)}
          </span>
          <span className='text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full'>
            {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}% OFF
          </span>
        </>
      )}
    </div>
  );
}
