'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  hasSubcategories: boolean;
  subcategories?: { name: string; id: string }[];
}

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Rings',
    hasSubcategories: true,
    subcategories: [
      { name: 'Engagement Rings', id: '1-1' },
      { name: 'Everyday Rings', id: '1-2' },
    ],
  },
  {
    id: '2',
    name: 'Necklace',
    hasSubcategories: true,
    subcategories: [
      { name: 'Mangalsutra', id: '2-1' },
      { name: 'Everyday Necklaces', id: '2-2' },
    ],
  },
  {
    id: '3',
    name: 'Earrings',
    hasSubcategories: false,
  },
  {
    id: '4',
    name: 'Bracelet',
    hasSubcategories: false,
  },
  {
    id: '5',
    name: 'Eira Collection',
    hasSubcategories: false,
  },
];

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ categoryId: string; subcategory: { name: string; id: string } } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      hasSubcategories: false,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setSuccess('Category added successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleAddSubcategory = (categoryId: string) => {
    if (!newSubcategoryName.trim()) {
      setError('Subcategory name is required');
      return;
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          hasSubcategories: true,
          subcategories: [
            ...(cat.subcategories || []),
            { name: newSubcategoryName.trim(), id: `${categoryId}-${Date.now()}` },
          ],
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setNewSubcategoryName('');
    setSuccess('Subcategory added successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: newCategoryName.trim() }
        : cat
    );

    setCategories(updatedCategories);
    setEditingCategory(null);
    setNewCategoryName('');
    setSuccess('Category updated successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEditSubcategory = (categoryId: string, subcategory: { name: string; id: string }) => {
    setEditingSubcategory({ categoryId, subcategory });
    setNewSubcategoryName(subcategory.name);
  };

  const handleUpdateSubcategory = () => {
    if (!editingSubcategory || !newSubcategoryName.trim()) {
      setError('Subcategory name is required');
      return;
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === editingSubcategory.categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories?.map(sub =>
            sub.id === editingSubcategory.subcategory.id
              ? { ...sub, name: newSubcategoryName.trim() }
              : sub
          ),
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setEditingSubcategory(null);
    setNewSubcategoryName('');
    setSuccess('Subcategory updated successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      setSuccess('Category deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          const updatedSubcategories = cat.subcategories?.filter(sub => sub.id !== subcategoryId);
          return {
            ...cat,
            hasSubcategories: (updatedSubcategories?.length || 0) > 0,
            subcategories: updatedSubcategories,
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setSuccess('Subcategory deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1E240A]">Manage Categories</h1>
                <p className="mt-2 text-gray-600">Add, edit, and organize product categories and subcategories</p>
              </div>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Back to Dashboard
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Add New Category */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1E240A] mb-4">Add New Category</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A]"
                />
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="px-6 py-2 bg-[#1E240A] text-white rounded-lg hover:bg-[#2A3A1A] transition-colors duration-200"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                {editingCategory && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#1E240A]">Categories</h2>
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#1E240A]">{category.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.hasSubcategories && category.subcategories && (
                    <div className="ml-4">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Subcategories</h4>
                      <div className="space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                            <span className="text-gray-700">{subcategory.name}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSubcategory(category.id, subcategory)}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Subcategory */}
                  <div className="mt-4 ml-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="Enter subcategory name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A]"
                      />
                      <button
                        onClick={editingSubcategory?.categoryId === category.id && editingSubcategory?.subcategory.id ? 
                          handleUpdateSubcategory : 
                          () => handleAddSubcategory(category.id)
                        }
                        className="px-4 py-2 bg-[#1E240A] text-white rounded text-sm hover:bg-[#2A3A1A] transition-colors duration-200"
                      >
                        {editingSubcategory?.categoryId === category.id && editingSubcategory?.subcategory.id ? 
                          'Update' : 'Add Subcategory'
                        }
                      </button>
                      {editingSubcategory?.categoryId === category.id && editingSubcategory?.subcategory.id && (
                        <button
                          onClick={() => {
                            setEditingSubcategory(null);
                            setNewSubcategoryName('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
