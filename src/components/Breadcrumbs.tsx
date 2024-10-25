import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '../types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <Link to="/" className="hover:text-blue-500">Hjem</Link>
      {items.map((item, index) => (
        <span key={item.path} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-200">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-blue-500">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}