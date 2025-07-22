
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className, inputClassName, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-brand-primary'} focus:border-transparent transition duration-150 ease-in-out ${inputClassName}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  textareaClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, textareaClassName, ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-brand-primary'} focus:border-transparent transition duration-150 ease-in-out ${textareaClassName}`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  selectClassName?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string; 
}

export const Select: React.FC<SelectProps> = ({ label, id, error, className, selectClassName, options, placeholder, ...restProps }) => {
  const hasExplicitEmptyValueOption = options.some(opt => opt.value === "");

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-brand-primary'} focus:border-transparent transition duration-150 ease-in-out bg-white ${selectClassName}`}
        {...restProps}
      >
        {/* Render a disabled placeholder option if a placeholder is provided AND no explicit empty-value option exists in `options` */}
        {placeholder && !hasExplicitEmptyValueOption && (
          <option value="" disabled> 
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};
