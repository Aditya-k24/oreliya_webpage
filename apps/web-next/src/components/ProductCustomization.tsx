'use client';

import { useState, useEffect } from 'react';
import type { ProductCustomization } from '@/types/product';

interface ProductCustomizationProps {
  customizations: ProductCustomization[];
  onCustomizationChange?: (customizations: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

export default function ProductCustomization({
  customizations,
  onCustomizationChange,
  initialValues = {}
}: ProductCustomizationProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sort customizations by sortOrder
  const sortedCustomizations = [...customizations].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  useEffect(() => {
    if (onCustomizationChange) {
      onCustomizationChange(values);
    }
  }, [values, onCustomizationChange]);

  const handleInputChange = (attribute: string, value: any) => {
    setValues(prev => ({ ...prev, [attribute]: value }));
    
    // Clear error when user starts typing
    if (errors[attribute]) {
      setErrors(prev => ({ ...prev, [attribute]: '' }));
    }
  };

  // Validation function for future use
  // const validateInput = (customization: ProductCustomization, value: any): string => {
  //   if (customization.required && (!value || value === '')) {
  //     return `${customization.name} is required`;
  //   }

  //   if (customization.type === 'text' && value) {
  //     if (customization.maxLength && value.length > customization.maxLength) {
  //       return `Maximum ${customization.maxLength} characters allowed`;
  //     }
  //     
  //     if (customization.pattern) {
  //       const regex = new RegExp(customization.pattern);
  //       if (!regex.test(value)) {
  //         return 'Invalid format';
  //       }
  //     }
  //   }

  //   if (customization.type === 'number' && value) {
  //     const numValue = Number(value);
  //     if (customization.minValue !== undefined && numValue < customization.minValue) {
  //       return `Minimum value is ${customization.minValue}`;
  //     }
  //     if (customization.maxValue !== undefined && numValue > customization.maxValue) {
  //       return `Maximum value is ${customization.maxValue}`;
  //     }
  //   }

  //   return '';
  // };

  const renderCustomizationField = (customization: ProductCustomization) => {
    const value = values[customization.name] || '';
    const error = errors[customization.name] || '';

    const baseInputClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A]";
    const errorInputClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";

    switch (customization.type) {
      case 'select':
        return (
          <div key={customization.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {customization.name}
              {customization.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(customization.name, e.target.value)}
              className={`${baseInputClasses} ${error ? errorInputClasses : 'border-gray-300'}`}
            >
              <option value="">Select {customization.name}</option>
              {customization.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {customization.helpText && (
              <p className="text-gray-500 text-sm">{customization.helpText}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={customization.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {customization.name}
              {customization.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(customization.name, e.target.value)}
              min={customization.minValue}
              max={customization.maxValue}
              className={`${baseInputClasses} ${error ? errorInputClasses : 'border-gray-300'}`}
              placeholder={`Enter ${customization.name.toLowerCase()}`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {customization.helpText && (
              <p className="text-gray-500 text-sm">{customization.helpText}</p>
            )}
            {(customization.minValue !== undefined || customization.maxValue !== undefined) && (
              <p className="text-gray-500 text-sm">
                Range: {customization.minValue || 'No minimum'} - {customization.maxValue || 'No maximum'}
              </p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={customization.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {customization.name}
              {customization.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(customization.name, e.target.value)}
              maxLength={customization.maxLength}
              className={`${baseInputClasses} ${error ? errorInputClasses : 'border-gray-300'}`}
              placeholder={`Enter ${customization.name.toLowerCase()}`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {customization.helpText && (
              <p className="text-gray-500 text-sm">{customization.helpText}</p>
            )}
            {customization.maxLength && (
              <p className="text-gray-500 text-sm">
                {value.length}/{customization.maxLength} characters
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#1E240A]">Customize Your Jewelry</h3>
      
      <div className="space-y-6">
        {sortedCustomizations.map(renderCustomizationField)}
      </div>

      {/* Customization Summary */}
      {Object.keys(values).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Customization:</h4>
          <div className="space-y-1">
            {Object.entries(values).map(([key, value]) => (
              value && (
                <div key={key} className="text-sm text-gray-600">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}