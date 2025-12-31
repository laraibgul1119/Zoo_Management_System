import React from 'react';
import { BoxIcon } from 'lucide-react';
interface FeatureCardProps {
  title: string;
  description: string;
  icon: BoxIcon;
  color: string;
  iconColor: string;
}
export function FeatureCard({
  title,
  description,
  icon: Icon,
  color,
  iconColor
}: FeatureCardProps) {
  return <div className="flex flex-col items-center text-center p-8 bg-white border-4 border-black h-full">
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{
      backgroundColor: color
    }}>
        <Icon className="w-12 h-12" style={{
        color: iconColor
      }} />
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-gray-600 font-medium leading-relaxed">{description}</p>
    </div>;
}