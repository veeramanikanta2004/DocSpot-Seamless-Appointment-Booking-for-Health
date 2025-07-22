
import React from 'react';
import { InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  title?: string;
  onClose?: () => void;
  className?: string;
}

const alertStyles = {
  info: {
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-500',
    titleColor: 'text-sky-800',
    textColor: 'text-sky-700',
    Icon: InformationCircleIcon,
  },
  success: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
    Icon: CheckCircleIcon,
  },
  warning: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
    Icon: ExclamationTriangleIcon,
  },
  error: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
    Icon: XCircleIcon,
  },
};

const Alert: React.FC<AlertProps> = ({ type, message, title, onClose, className }) => {
  const styles = alertStyles[type];
  const Icon = styles.Icon;

  return (
    <div className={`rounded-md p-4 shadow ${styles.bg} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${styles.iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h3>}
          <div className={`mt-1 text-sm ${styles.textColor}`}>
            <p>{message}</p>
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${styles.iconBg} ${styles.textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.iconColor}`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
