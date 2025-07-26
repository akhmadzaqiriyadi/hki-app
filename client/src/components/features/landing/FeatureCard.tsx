import React from 'react';

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
};
export default function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}