'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductCustomizationManager from '@/components/admin/ProductCustomizationManager';
import { ImageUpload } from '@/components/ImageUpload';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { ProductCustomization } from '@/types/product';

// Cache key for form data
// const FORM_CACHE_KEY = 'product-edit-cache';

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
  customizations?: ProductCustomization[];
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
  const { uploadImage, isUploading } = useImageUpload();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: string;
    compareAtPrice: string;
    category: string;
    tags: string;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
    isOnSale: boolean;
    salePercentage: string;
    customizations: ProductCustomization[];
  }>({
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
    customizations: [],
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
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        const productData = data.data;
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
          customizations: productData.customizations || [],
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


  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };


  const handleFileUpload = async (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    try {
      const result = await uploadImage(file, { folder: 'products' });
      if (result.success && result.url) {
        const newImages = [...formData.images];
        newImages[index] = result.url;
        setFormData(prev => ({ ...prev, images: newImages }));
      } else {
        setError(result.message || 'Image upload failed');
      }
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleMultipleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadImage(file, { folder: 'products' })
      );
      
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success && result.url);
      
      if (successfulUploads.length > 0) {
        const newUrls = successfulUploads.map(result => result.url!);
        const currentImages = formData.images.filter(img => img.trim());
        setFormData(prev => ({ 
          ...prev, 
          images: [...currentImages, ...newUrls] 
        }));
      }
      
      if (successfulUploads.length < files.length) {
        setError(`Only ${successfulUploads.length} of ${files.length} images uploaded successfully`);
      }
    } catch (err) {
      setError('Failed to upload images');
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const isValidUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isPresignedUrl = (url: string): boolean => {
    if (!url || !url.trim()) return false;
    return url.includes('supabase') || url.includes('storage') || url.includes('presigned') || url.includes('blob:');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (formData.compareAtPrice && parseFloat(formData.compareAtPrice) <= parseFloat(formData.price)) {
      errors.compareAtPrice = 'Compare at price must be higher than regular price';
    }

    if (formData.isOnSale && (!formData.salePercentage || parseInt(formData.salePercentage) < 1 || parseInt(formData.salePercentage) > 100)) {
      errors.salePercentage = 'Sale percentage must be between 1 and 100';
    }

    const validImages = formData.images.filter(img => img.trim() && (isValidUrl(img) || isPresignedUrl(img)));
    if (validImages.length === 0) {
      errors.images = 'At least one valid image URL is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      setSaving(false);
      return;
    }

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
        customizations: formData.customizations,
      };


      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[#1E240A] rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Update product information • {product?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Error updating product</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                        validationErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      required
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                        validationErrors.slug ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="product-url-slug"
                    />
                    <p className="text-xs text-gray-500">Used in the product URL</p>
                    {validationErrors.slug && (
                      <p className="text-sm text-red-600">{validationErrors.slug}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                      Short Description
                    </label>
                    <input
                      type="text"
                      id="shortDescription"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                      placeholder="Brief product summary (optional)"
                    />
                    <p className="text-xs text-gray-500">A concise description for product cards</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                        validationErrors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe your product in detail..."
                    />
                    <p className="text-xs text-gray-500">Detailed description for the product page</p>
                    {validationErrors.description && (
                      <p className="text-sm text-red-600">{validationErrors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Category Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Pricing & Category</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (₹) <span className="text-red-500">*</span>
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
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                        validationErrors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {validationErrors.price && (
                      <p className="text-sm text-red-600">{validationErrors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700">
                      Compare At Price (₹)
                    </label>
                    <input
                      type="number"
                      id="compareAtPrice"
                      name="compareAtPrice"
                      step="0.01"
                      min="0"
                      value={formData.compareAtPrice}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                        validationErrors.compareAtPrice ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500">Original price to show discount</p>
                    {validationErrors.compareAtPrice && (
                      <p className="text-sm text-red-600">{validationErrors.compareAtPrice}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                        validationErrors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      <option value="rings">Rings</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="mangalsutra">Mangalsutra</option>
                      <option value="other">Other</option>
                    </select>
                    {validationErrors.category && (
                      <p className="text-sm text-red-600">{validationErrors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                      placeholder="gold, elegant, luxury, handmade"
                    />
                    <p className="text-xs text-gray-500">Separate tags with commas</p>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Product Images</h2>
                </div>

                {/* Current Images Grid */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.filter(img => img.trim()).map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          {image.startsWith('blob:') ? (
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (isValidUrl(image) || isPresignedUrl(image)) ? (
                            <Image
                              src={image}
                              alt={`Product image ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Overlay with controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, index - 1)}
                                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                title="Move left"
                              >
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {index < formData.images.filter(img => img.trim()).length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImage(index, index + 1)}
                                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                title="Move right"
                              >
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                              title="Remove image"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Main image indicator */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {formData.images.filter(img => img.trim()).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>No images uploaded yet</p>
                    </div>
                  )}
                </div>

                {/* Add New Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Images</h3>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-4">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="text-lg font-medium text-gray-700">Upload Images</span>
                          <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleMultipleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                </div>


                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Pro tip:</strong> The first image will be used as the main product image. Upload high-quality images for the best customer experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Settings Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Status & Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#1E240A] focus:ring-[#1E240A] border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-900">
                          Active
                        </label>
                        <p className="text-xs text-gray-500">Product is visible to customers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <input
                        id="isFeatured"
                        name="isFeatured"
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#1E240A] focus:ring-[#1E240A] border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-900">
                          Featured
                        </label>
                        <p className="text-xs text-gray-500">Show on homepage</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <input
                        id="isOnSale"
                        name="isOnSale"
                        type="checkbox"
                        checked={formData.isOnSale}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#1E240A] focus:ring-[#1E240A] border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <label htmlFor="isOnSale" className="text-sm font-medium text-gray-900">
                          On Sale
                        </label>
                        <p className="text-xs text-gray-500">Show discount badge</p>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.isOnSale && (
                  <div className="mt-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-2">
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
                          className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 ${
                            validationErrors.salePercentage ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter percentage (1-100)"
                        />
                        <p className="text-xs text-gray-500">Discount percentage to display</p>
                        {validationErrors.salePercentage && (
                          <p className="text-sm text-red-600">{validationErrors.salePercentage}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Customizations */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-pink-100 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Product Customizations</h2>
                </div>
                <ProductCustomizationManager
                  productId={productId || ''}
                  productCategory={formData.category}
                  existingCustomizations={formData.customizations}
                  onCustomizationsChange={(customizations) => {
                    setFormData(prev => ({ ...prev, customizations }));
                  }}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link
                  href="/admin"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] transition-colors duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#1E240A] text-white rounded-lg text-sm font-medium hover:bg-[#2A3A1A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {saving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
