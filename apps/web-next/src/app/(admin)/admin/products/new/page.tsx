'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCustomizationManager from '@/components/admin/ProductCustomizationManager';
// import type { ProductCustomization } from '@/types/product';

// Cache key for form data
const FORM_CACHE_KEY = 'product-form-cache';

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load cached form data or initialize with defaults
  const loadCachedFormData = () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(FORM_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return {
            name: parsed.name || '',
            slug: parsed.slug || '',
            description: parsed.description || '',
            shortDescription: parsed.shortDescription || '',
            price: parsed.price || '',
            compareAtPrice: parsed.compareAtPrice || '',
            category: parsed.category || '',
            tags: parsed.tags || '',
            images: parsed.images || [''],
            imageFiles: [] as File[], // Can't cache File objects
            isActive: parsed.isActive ?? true,
            isFeatured: parsed.isFeatured ?? false,
            isOnSale: parsed.isOnSale ?? false,
            salePercentage: parsed.salePercentage || '',
            customizations: parsed.customizations || [],
          };
        } catch (error) {
          console.error('Error parsing cached form data:', error);
        }
      }
    }
    return {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      compareAtPrice: '',
      category: '',
      tags: '',
      images: [''],
      imageFiles: [] as File[],
      isActive: true,
      isFeatured: false,
      isOnSale: false,
      salePercentage: '',
      customizations: [],
    };
  };

  const [formData, setFormData] = useState(loadCachedFormData);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  // Save form data to cache
  const saveToCache = (data: typeof formData) => {
    if (typeof window !== 'undefined') {
      try {
        // Don't cache File objects, only the image URLs
        const cacheableData = {
          ...data,
          imageFiles: [] // Remove File objects from cache
        };
        localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(cacheableData));
      } catch (error) {
        console.error('Error saving form data to cache:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Use functional updates to avoid stale state and re-render loops
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      } as typeof prev;
      // persist outside of render
      queueMicrotask(() => saveToCache(next));
      return next;
    });
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      const next = { ...prev, images: newImages };
      queueMicrotask(() => saveToCache(next));
      return next;
    });
  };

  const addImageField = () => {
    setFormData(prev => {
      const next = { ...prev, images: [...prev.images, ''] };
      queueMicrotask(() => saveToCache(next));
      return next;
    });
  };

  const removeImageField = (index: number) => {
    setFormData(prev => {
      if (prev.images.length <= 1) return prev;
      const newImages = prev.images.filter((_: unknown, i: number) => i !== index);
      const newImageFiles = prev.imageFiles.filter((_: unknown, i: number) => i !== index);
      const next = { ...prev, images: newImages, imageFiles: newImageFiles };
      queueMicrotask(() => saveToCache(next));
      return next;
    });
  };

  const handleFileUpload = (index: number, files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    setFormData(prev => {
      const newImageFiles = [...prev.imageFiles];
      newImageFiles[index] = file;
      const newImages = [...prev.images];
      newImages[index] = URL.createObjectURL(file);
      const next = { ...prev, images: newImages, imageFiles: newImageFiles };
      queueMicrotask(() => saveToCache(next));
      return next;
    });
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    return data.url;
  };

  // Clear cache when form is successfully submitted
  const clearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_CACHE_KEY);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload files and get URLs
      const uploadedImages = await Promise.all(
        formData.imageFiles.map(async (file, index) => {
          if (file) {
            return await uploadImageFile(file);
          } else {
            return formData.images[index] || '';
          }
        })
      );

      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription || undefined,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        category: formData.category,
        tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        images: uploadedImages.filter(img => img.trim()),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isOnSale: formData.isOnSale,
        salePercentage: formData.salePercentage ? parseInt(formData.salePercentage) : undefined,
        customizations: formData.customizations,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

          if (data.success) {
            setSuccess(true);
            clearCache(); // Clear cached data on successful submission
            setTimeout(() => {
              router.push('/admin');
            }, 2000);
          } else {
            setError(data.message || 'Failed to create product');
          }
    } catch (err) {
      setError('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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
            Product created successfully! Redirecting...
          </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Create a new product for your store • Auto-saved locally
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Auto-saving...</span>
                  </div>
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
                    <p className="text-sm text-red-700 font-medium">Error creating product</p>
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
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                          placeholder="Enter product name"
                        />
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
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                          placeholder="product-url-slug"
                        />
                        <p className="text-xs text-gray-500">Used in the product URL</p>
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
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 resize-none"
                          placeholder="Detailed product description..."
                        />
                        <p className="text-xs text-gray-500">Provide detailed information about the product</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Details Section */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Pricing & Details</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            min="0"
                            required
                            value={formData.price}
                            onChange={handleInputChange}
                            className="block w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700">
                          Compare At Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            id="compareAtPrice"
                            name="compareAtPrice"
                            step="0.01"
                            min="0"
                            value={formData.compareAtPrice}
                            onChange={handleInputChange}
                            className="block w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Original price before discounts</p>
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
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                        >
                          <option value="">Select a category</option>
                          <option value="rings">Rings</option>
                          <option value="earrings">Earrings</option>
                          <option value="bracelets">Bracelets</option>
                          <option value="necklaces">Necklaces</option>
                          <option value="mangalsutra">Mangalsutra</option>
                          <option value="other">Other</option>
                        </select>
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

                    <div className="space-y-6">
                      {formData.images.map((image: string, index: number) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Image {index + 1} {index === 0 && <span className="text-sm text-blue-600">(Main Image)</span>}
                            </h3>
                            {formData.images.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Image URL
                                </label>
                                <input
                                  type="url"
                                  value={image.startsWith('blob:') ? '' : image}
                                  onChange={(e) => handleImageChange(index, e.target.value)}
                                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Or Upload from Device
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(index, e.target.files)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#1E240A] file:text-white hover:file:bg-[#2A3A1A] transition-colors duration-200"
                                  />
                                </div>
                              </div>
                            </div>

                            {image && (
                              <div className="flex justify-center">
                                <div className="relative">
                                  <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="h-48 w-48 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                                  />
                                  {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                      Main
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={addImageField}
                        className="inline-flex items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Another Image
                      </button>
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
                            <p className="text-xs text-gray-500">Apply discount pricing</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData.isOnSale && (
                      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">Sale Settings</h3>
                        </div>
                        <div className="max-w-xs">
                          <label htmlFor="salePercentage" className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Percentage
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="salePercentage"
                              name="salePercentage"
                              min="1"
                              max="100"
                              value={formData.salePercentage}
                              onChange={handleInputChange}
                              className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200"
                              placeholder="0"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">%</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Enter the discount percentage (1-100%)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Customizations */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <ProductCustomizationManager
                      productId=""
                      productCategory={formData.category}
                      existingCustomizations={formData.customizations}
                      onCustomizationsChange={(customizations) => {
                        setFormData(prev => ({ ...prev, customizations }));
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gray-50 -mx-6 -mb-8 px-6 py-6 sm:-mx-8 sm:px-8 sm:py-8 rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
                              clearCache();
                              setFormData({
                                name: '',
                                slug: '',
                                description: '',
                                shortDescription: '',
                                price: '',
                                compareAtPrice: '',
                                category: '',
                                tags: '',
                                images: [''],
                                imageFiles: [],
                                isActive: true,
                                isFeatured: false,
                                isOnSale: false,
                                salePercentage: '',
                                customizations: [],
                              });
                            }
                          }}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear Form
                        </button>
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                          Auto-saved to browser cache
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          href="/admin"
                          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1E240A] hover:bg-[#2A3A1A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E240A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Product...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Create Product
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
