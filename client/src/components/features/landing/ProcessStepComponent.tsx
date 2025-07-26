import React from 'react';

type ProcessStepProps = {
  step: number | string;
  title: string;
  description: string;
};

export default function ProcessStep({ step, title, description }: ProcessStepProps) {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg shadow-lg">
        {step}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
