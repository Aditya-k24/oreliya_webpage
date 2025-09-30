'use client';

import { useState, useEffect } from 'react';
import { CUSTOMIZATION_TEMPLATES } from '@/lib/jewelry-customization';
import type { ProductCustomization } from '@/types/product';

interface ProductCustomizationManagerProps {
  productId: string;
  productCategory: string;
  existingCustomizations: ProductCustomization[];
  onCustomizationsChange: (customizations: ProductCustomization[]) => void;
}

export default function ProductCustomizationManager({
  productId: _productId,
  productCategory,
  existingCustomizations,
  onCustomizationsChange
}: ProductCustomizationManagerProps) {
  const [customizations, setCustomizations] = useState<ProductCustomization[]>(existingCustomizations);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    onCustomizationsChange(customizations);
    // Intentionally omit onCustomizationsChange to avoid effect firing on every parent render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizations]);

  const getTemplatesForCategory = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    
    // Map common category variations to our template keys
    const categoryMap: Record<string, string> = {
      'ring': 'rings',
      'rings': 'rings',
      'earring': 'earrings', 
      'earrings': 'earrings',
      'bracelet': 'bracelets',
      'bracelets': 'bracelets',
      'necklace': 'necklaces',
      'necklaces': 'necklaces',
      'mangalsutra': 'mangalsutra',
      'mangalsutras': 'mangalsutra'
    };
    
    const templateKey = categoryMap[normalizedCategory] || normalizedCategory;
    const templates = CUSTOMIZATION_TEMPLATES[templateKey as keyof typeof CUSTOMIZATION_TEMPLATES] || [];
    return [...templates]; // Convert readonly array to mutable array
  };

  const addTemplateCustomizations = (template: unknown[]) => {
    const newCustomizations = template.map((t: any, index) => ({
      id: `temp-${Date.now()}-${index}`,
      name: t.name,
      type: t.type,
      required: t.required,
      options: t.options ? [...t.options] : [],
      minValue: t.minValue,
      maxValue: t.maxValue,
      maxLength: t.maxLength,
      pattern: t.pattern,
      helpText: t.helpText,
      category: t.category,
      isEnabled: true,
      sortOrder: t.sortOrder
    }));

    setCustomizations(prev => [...prev, ...newCustomizations]);
    setShowTemplateSelector(false);
  };

  const addCustomCustomization = () => {
    const newCustomization: ProductCustomization = {
      id: `temp-${Date.now()}`,
      name: '',
      type: 'select',
      required: false,
      options: [],
      isEnabled: true,
      sortOrder: customizations.length + 1
    };
    setCustomizations(prev => [...prev, newCustomization]);
  };

  const updateCustomization = (id: string, updates: Partial<ProductCustomization>) => {
    setCustomizations(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const removeCustomization = (id: string) => {
    setCustomizations(prev => prev.filter(c => c.id !== id));
  };

  const moveCustomization = (id: string, direction: 'up' | 'down') => {
    setCustomizations(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      
      const newCustomizations = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newCustomizations.length) {
        [newCustomizations[index], newCustomizations[targetIndex]] = 
        [newCustomizations[targetIndex], newCustomizations[index]];
      }
      
      return newCustomizations;
    });
  };

  const templates = getTemplatesForCategory(productCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Customizations</h3>
        <div className="space-x-2">
          {templates.length > 0 && (
            <button
              type="button"
              onClick={() => setShowTemplateSelector(true)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Template
            </button>
          )}
          <button
            type="button"
            onClick={addCustomCustomization}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Custom
          </button>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h4 className="text-lg font-medium mb-4">Add Template Customizations</h4>
            <p className="text-gray-600 mb-4">
              Add standard customizations for <strong>{productCategory}</strong> category:
            </p>
            
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No templates available for this category.</p>
                <p className="text-sm text-gray-400">
                  Category: &quot;{productCategory}&quot;<br/>
                  Available categories: rings, earrings, bracelets, necklaces, mangalsutra
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {templates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{template.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${
                          template.required 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {template.required ? 'Required' : 'Optional'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {template.type}
                        </span>
                      </div>
                      {'helpText' in template && template.helpText && (
                        <p className="text-xs text-gray-500 mt-1">{template.helpText}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex space-x-3">
              {templates.length > 0 && (
                <button
                  type="button"
                  onClick={() => addTemplateCustomizations(templates)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add All ({templates.length} options)
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowTemplateSelector(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customizations List */}
      <div className="space-y-4">
        {customizations.map((customization, index) => (
          <div key={customization.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {customization.name || 'Unnamed Customization'}
                </span>
                {customization.required && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    Required
                  </span>
                )}
                {!customization.isEnabled && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                    Disabled
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => moveCustomization(customization.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveCustomization(customization.id, 'down')}
                  disabled={index === customizations.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeCustomization(customization.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={customization.name}
                  onChange={(e) => updateCustomization(customization.id, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Metal Type, Ring Size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={customization.type}
                  onChange={(e) => updateCustomization(customization.id, { type: e.target.value as 'text' | 'image' | 'color' | 'select' | 'number' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="select">Select</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="color">Color</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.required}
                    onChange={(e) => updateCustomization(customization.id, { required: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Required</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customization.isEnabled}
                    onChange={(e) => updateCustomization(customization.id, { isEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>

              {customization.type === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options (one per line)
                  </label>
                  <textarea
                    value={customization.options?.join('\n') || ''}
                    onChange={(e) => updateCustomization(customization.id, { 
                      options: e.target.value.split('\n').filter(opt => opt.trim()) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}

              {customization.type === 'number' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Value
                    </label>
                    <input
                      type="number"
                      value={customization.minValue || ''}
                      onChange={(e) => updateCustomization(customization.id, { 
                        minValue: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Value
                    </label>
                    <input
                      type="number"
                      value={customization.maxValue || ''}
                      onChange={(e) => updateCustomization(customization.id, { 
                        maxValue: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {customization.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={customization.maxLength || ''}
                    onChange={(e) => updateCustomization(customization.id, { 
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <input
                  type="text"
                  value={customization.helpText || ''}
                  onChange={(e) => updateCustomization(customization.id, { helpText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional help text for users"
                />
              </div>
            </div>
          </div>
        ))}

        {customizations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No customizations added yet.</p>
            <p className="text-sm">Use the buttons above to add template or custom customizations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
