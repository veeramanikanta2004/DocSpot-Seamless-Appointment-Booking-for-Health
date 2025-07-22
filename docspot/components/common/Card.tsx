
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, title, titleClassName, actions }) => {
  return (
    <div className={`bg-brand-surface rounded-lg shadow-lg p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
          {title && <h3 className={`text-xl font-semibold text-brand-text-primary ${titleClassName}`}>{title}</h3>}
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
