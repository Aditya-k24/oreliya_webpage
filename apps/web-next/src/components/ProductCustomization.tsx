'use client';

import { useState, useEffect } from 'react';
import type { ProductCustomization as CustomizationOption } from '@/types/product';

interface ProductCustomizationProps {
  customizations: CustomizationOption[];
  onCustomizationChange?: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

const labelCls =
  'block text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/40 mb-2';
const inputCls =
  'w-full bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none py-2 text-[#1E240A] text-sm tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25';

export default function ProductCustomization({
  customizations,
  onCustomizationChange,
  initialValues = {},
}: ProductCustomizationProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const sorted = [...customizations].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  useEffect(() => {
    if (onCustomizationChange) onCustomizationChange(values);
  }, [values, onCustomizationChange]);

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (c: CustomizationOption) => {
    const value = values[c.name] || '';

    if (c.type === 'select') {
      return (
        <div key={c.id}>
          <label className={labelCls}>
            {c.name}
            {c.required && <span className='text-[#1E240A]/40 ml-1'>*</span>}
          </label>
          <select
            value={value}
            onChange={e => handleChange(c.name, e.target.value)}
            className={`${inputCls} cursor-pointer`}
          >
            <option value=''>Select {c.name}</option>
            {c.options?.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {c.helpText && (
            <p className='text-[#1E240A]/35 text-[10px] mt-1.5 tracking-wide'>
              {c.helpText}
            </p>
          )}
        </div>
      );
    }

    if (c.type === 'number') {
      return (
        <div key={c.id}>
          <label className={labelCls}>
            {c.name}
            {c.required && <span className='text-[#1E240A]/40 ml-1'>*</span>}
          </label>
          <input
            type='number'
            value={value}
            onChange={e => handleChange(c.name, e.target.value)}
            min={c.minValue}
            max={c.maxValue}
            placeholder={`Enter ${c.name.toLowerCase()}`}
            className={inputCls}
          />
          {c.helpText && (
            <p className='text-[#1E240A]/35 text-[10px] mt-1.5 tracking-wide'>
              {c.helpText}
            </p>
          )}
        </div>
      );
    }

    if (c.type === 'text') {
      return (
        <div key={c.id}>
          <label className={labelCls}>
            {c.name}
            {c.required && <span className='text-[#1E240A]/40 ml-1'>*</span>}
          </label>
          <input
            type='text'
            value={value}
            onChange={e => handleChange(c.name, e.target.value)}
            maxLength={c.maxLength}
            placeholder={`Enter ${c.name.toLowerCase()}`}
            className={inputCls}
          />
          {c.maxLength && (
            <p className='text-[#1E240A]/25 text-[10px] mt-1.5 tracking-wide text-right'>
              {value.length}/{c.maxLength}
            </p>
          )}
          {c.helpText && (
            <p className='text-[#1E240A]/35 text-[10px] mt-1.5 tracking-wide'>
              {c.helpText}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  const filledValues = Object.entries(values).filter(([, v]) => v);

  return (
    <div className='space-y-8'>
      <p className='text-[9px] uppercase tracking-[0.4em] text-[#1E240A]/35'>
        Customise
      </p>

      <div className='space-y-8'>{sorted.map(renderField)}</div>

      {filledValues.length > 0 && (
        <div className='pt-4 border-t border-[#1E240A]/10 space-y-3'>
          <p className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/30'>
            Your selection
          </p>
          {filledValues.map(([k, v]) => (
            <div
              key={k}
              className='flex items-start justify-between gap-4 text-xs'
            >
              <span className='text-[#1E240A]/40 uppercase tracking-[0.15em] text-[10px]'>
                {k}
              </span>
              <span className='text-[#1E240A]'>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
