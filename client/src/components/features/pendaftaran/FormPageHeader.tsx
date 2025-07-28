import React from 'react';
import { FileText } from 'lucide-react';

interface FormPageHeaderProps {
  title: string;
  description: string;
}

export default function FormPageHeader({ title, description }: FormPageHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl flex-shrink-0">
        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
          {title} <span className="text-blue-900">📝</span>
        </h1>
        <p className="text-base text-slate-600 font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}