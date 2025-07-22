
import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold text-brand-text-primary">{title}</h1>
      {subtitle && <p className="mt-1 text-md text-brand-text-secondary">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
