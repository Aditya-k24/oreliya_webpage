import { Link } from 'react-router-dom';
import { PriceTag } from './PriceTag';
import { Badge } from './Badge';

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment?: number;
}

interface ProductCustomization {
  id: string;
  name: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  priceAdjustment?: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  isOnSale?: boolean;
  salePercentage?: number;
  variants?: ProductVariant[];
  customizations?: ProductCustomization[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage =
    product.images?.[0] || product.imageUrl || '/placeholder-product.jpg';
  const description = product.description || product.subtitle || '';
  const category = product.category || 'Jewelry';
  const tags = product.tags || [];
  const { isOnSale = false, salePercentage, variants = [] } = product;

  return (
    <Link
      to={`/products/${product.id}`}
      className='group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700'
    >
      {/* Image Container */}
      <div className='relative aspect-square overflow-hidden'>
        <img
          src={mainImage}
          alt={product.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          onError={e => {
            (e.currentTarget as HTMLImageElement).src =
              '/placeholder-product.jpg';
          }}
        />
        {/* Sale Badge */}
        {isOnSale && salePercentage && (
          <Badge variant='primary' className='absolute top-3 left-3'>
            {salePercentage}% OFF
          </Badge>
        )}

        {/* Quick Actions Overlay */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center'>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0'>
            <div className='bg-white text-gray-900 px-4 py-2 rounded-lg font-medium'>
              View Details
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Category */}
        <div className='mb-2'>
          <Badge variant='secondary' className='text-xs'>
            {category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className='font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#BFA16A] transition-colors'>
          {product.name}
        </h3>

        {/* Description */}
        {description && (
          <p className='text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2'>
            {description}
          </p>
        )}

        {/* Price */}
        <div className='flex items-center justify-between'>
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size='lg'
          />

          {/* Variants indicator */}
          {variants.length > 0 && (
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {variants.length} variants
            </span>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-1'>
            {tags.slice(0, 3).map(tag => (
              <span
                key={`${product.id}-${tag}`}
                className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className='text-xs text-gray-400'>
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
