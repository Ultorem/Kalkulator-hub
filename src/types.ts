export type Theme = 'light' | 'dark' | 'system';

export interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'helse' | 'økonomi' | 'konvertering' | 'teknisk' | 'verktøy';
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export type Language = 'no' | 'en' | 'se' | 'dk' | 'de';

export interface Translation {
  [key: string]: string;
}