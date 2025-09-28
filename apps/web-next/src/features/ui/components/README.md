# SearchAndFilter Component

A comprehensive, reusable search and filter component designed specifically for product pages in the Oreliya jewelry website. This component provides real-time filtering, searching, and sorting capabilities with a consistent UI theme.

## Features

- **Real-time Search**: Search products by name and description
- **Category Filtering**: Filter by main categories (Rings, Necklace, Earrings, Bracelet, Eira Collection)
- **Subcategory Filtering**: Dynamic subcategory filtering based on selected category
- **Price Range Filtering**: Set minimum and maximum price filters
- **Stock Status Filtering**: Filter by availability (All, In Stock, Out of Stock)
- **Sorting Options**: Sort by name, price (ascending/descending), or newest first
- **URL State Management**: All filters are reflected in the URL for bookmarking and sharing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Consistent UI**: Matches the Oreliya brand theme with proper colors and styling

## Usage

### Basic Implementation

```tsx
import { SearchAndFilter } from '@/features/ui/components/SearchAndFilter';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';

function MyProductPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch your products here
    const products = await fetchProducts();
    setAllProducts(products);
    setFilteredProducts(products);
  }, []);

  return (
    <div>
      <SearchAndFilter 
        products={allProducts} 
        onFilteredProducts={setFilteredProducts}
      />
      
      {/* Your product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Advanced Implementation with URL Parameters

```tsx
import { useSearchParams } from 'next/navigation';

function ProductsPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Handle initial URL-based filtering
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setAllProducts(products);
      
      // Apply initial URL filters
      let initialProducts = products;
      const category = searchParams.get('category');
      const subcategory = searchParams.get('subcategory');
      
      if (category) {
        initialProducts = initialProducts.filter(p => p.category === category);
      }
      if (subcategory) {
        initialProducts = initialProducts.filter(p => p.subcategory === subcategory);
      }
      
      setFilteredProducts(initialProducts);
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div>
      <SearchAndFilter 
        products={allProducts} 
        onFilteredProducts={setFilteredProducts}
        className="mb-8" // Optional custom styling
      />
      
      <div className="mb-6 text-center">
        <p className="text-[#1E240A]/70">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `products` | `Product[]` | ✅ | Array of all products to filter |
| `onFilteredProducts` | `(products: Product[]) => void` | ✅ | Callback function called when filters change |
| `className` | `string` | ❌ | Optional additional CSS classes |

## Filter Types

### Search Filter
- **Type**: Text input
- **Functionality**: Searches product names and descriptions
- **URL Parameter**: `?search=keyword`

### Category Filter
- **Type**: Dropdown select
- **Options**: All Categories, Rings, Necklace, Earrings, Bracelet, Eira Collection
- **URL Parameter**: `?category=Rings`

### Subcategory Filter
- **Type**: Dropdown select (dynamic)
- **Functionality**: Shows subcategories based on selected category
- **URL Parameter**: `?subcategory=Engagement%20Rings`

### Price Range Filter
- **Type**: Two number inputs (min/max)
- **Functionality**: Filter products within price range
- **URL Parameters**: `?minPrice=10000&maxPrice=100000`

### Stock Status Filter
- **Type**: Radio buttons
- **Options**: All, In Stock, Out of Stock
- **URL Parameter**: `?inStock=true`

### Sort Filter
- **Type**: Dropdown select
- **Options**: Name (A-Z), Price (Low to High), Price (High to Low), Newest First
- **URL Parameter**: `?sortBy=price-asc`

## URL State Management

The component automatically manages URL state, allowing users to:
- Bookmark filtered results
- Share filtered URLs
- Use browser back/forward buttons
- Refresh the page while maintaining filters

Example URLs:
- `/products?category=Rings&subcategory=Engagement%20Rings`
- `/products?search=diamond&minPrice=50000&maxPrice=200000`
- `/products?inStock=true&sortBy=price-asc`

## Styling

The component uses Tailwind CSS classes that match the Oreliya brand theme:

- **Primary Color**: `#1E240A` (dark green)
- **Background**: `#F6EEDF` (cream)
- **Accent**: `#2A3A1A` (darker green for hover states)
- **Text**: Various shades of the primary color with opacity

### Custom Styling

You can add custom styling using the `className` prop:

```tsx
<SearchAndFilter 
  products={allProducts} 
  onFilteredProducts={setFilteredProducts}
  className="mb-8 shadow-lg" // Additional classes
/>
```

## Product Interface

The component expects products to match this interface:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Examples

### Demo Page
Visit `/products/demo` to see the component in action with sample data.

### Integration Examples
- `/products` - Main products page with SearchAndFilter
- `/products/demo` - Demo page showcasing all features

## Performance Considerations

- The component uses `useEffect` for efficient re-rendering
- Filtering is performed client-side for immediate feedback
- URL updates use `router.replace()` to avoid adding to browser history
- The component is optimized for typical product catalog sizes (hundreds to low thousands of products)

## Browser Support

- Modern browsers with ES6+ support
- Mobile-responsive design
- Touch-friendly interface elements
- Accessible keyboard navigation

## Future Enhancements

Potential future improvements:
- Server-side filtering for large product catalogs
- Advanced filters (brand, material, etc.)
- Filter presets/saved searches
- Analytics integration for filter usage tracking
- Infinite scroll with filtered results
