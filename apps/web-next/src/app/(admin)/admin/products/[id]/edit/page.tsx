'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Cache key for form data
const FORM_CACHE_KEY = 'product-edit-cache';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    category: '',
    tags: '',
    images: [''],
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    salePercentage: '',
  });

  // Resolve params
  useEffect(() => {
    params.then((resolvedParams) => {
      setProductId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      const response = await fetch(`/api/products?id=${productId}`);
      const data = await response.json();
      
      if (data.success) {
        const productData = data.data.product;
        setProduct(productData);
        setFormData({
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          shortDescription: productData.shortDescription || '',
          price: productData.price.toString(),
          compareAtPrice: productData.compareAtPrice?.toString() || '',
          category: productData.category,
          tags: productData.tags.join(', '),
          images: productData.images.length > 0 ? productData.images : [''],
          isActive: productData.isActive,
          isFeatured: productData.isFeatured,
          isOnSale: productData.isOnSale,
          salePercentage: productData.salePercentage?.toString() || '',
        });
      } else {
        setError('Failed to fetch product');
      }
    } catch (err) {
      setError('Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription || undefined,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: formData.images.filter(img => img.trim()),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isOnSale: formData.isOnSale,
        salePercentage: formData.salePercentage ? parseInt(formData.salePercentage) : undefined,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update product');
      }
    } catch (err) {
      setError('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1E240A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Product updated successfully! Redirecting...
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Product not found
          </div>
          <Link
            href="/admin"
            className="text-[#1E240A] hover:text-[#2A3A1A]"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update product information
              </p>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                    placeholder="product-url-slug"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700">
                    Compare At Price
                  </label>
                  <input
                    type="number"
                    id="compareAtPrice"
                    name="compareAtPrice"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Eira Collection">Eira Collection</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Images
                </label>
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        disabled={formData.images.length === 1}
                        className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={addImageField}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A]"
                  >
                    + Add Another Image
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Add multiple images for your product. The first image will be used as the main product image.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1E240A] focus:ring-[#1E240A] border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1E240A] focus:ring-[#1E240A] border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Featured
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="isOnSale"
                    name="isOnSale"
                    type="checkbox"
                    checked={formData.isOnSale}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1E240A] focus:ring-[#1E240A] border-gray-300 rounded"
                  />
                  <label htmlFor="isOnSale" className="ml-2 block text-sm text-gray-900">
                    On Sale
                  </label>
                </div>
              </div>

              {formData.isOnSale && (
                <div>
                  <label htmlFor="salePercentage" className="block text-sm font-medium text-gray-700">
                    Sale Percentage
                  </label>
                  <input
                    type="number"
                    id="salePercentage"
                    name="salePercentage"
                    min="1"
                    max="100"
                    value={formData.salePercentage}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1E240A] focus:border-[#1E240A] sm:text-sm"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1E240A] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#2A3A1A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
