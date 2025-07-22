
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-136px)] flex flex-col items-center justify-center text-center px-4 bg-slate-100">
      <img src="https://picsum.photos/seed/404page/300/300" alt="Lost" className="w-64 h-64 mb-8 rounded-full shadow-lg"/>
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-brand-text-primary mb-4">Page Not Found</h2>
      <p className="text-lg text-brand-text-secondary mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link to={ROUTES.LANDING}>
        <Button variant="primary" size="lg">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
