import React from 'react';
type AnimalType = 'elephant' | 'giraffe' | 'lion' | 'penguin';
interface AnimalShapeProps {
  type: AnimalType;
  className?: string;
  color?: string;
}
export function AnimalShape({
  type,
  className = '',
  color = 'currentColor'
}: AnimalShapeProps) {
  const getPath = () => {
    switch (type) {
      case 'elephant':
        return <path d="M136.8 19.5c-27.4-1.8-49.8 15.6-55.8 21.6-6 6-16.2 13.8-24 13.8-6.6 0-12.6-4.2-12.6-4.2s-3-12-16.2-12C15 38.7 4.2 49.5 4.2 62.7c0 8.4 4.2 15.6 10.2 19.8 0 0-4.2 12-4.2 19.2 0 10.2 7.8 18.6 17.4 19.8v16.8c0 7.2 6 13.2 13.2 13.2h10.8c7.2 0 13.2-6 13.2-13.2V123h19.2v15.6c0 7.2 6 13.2 13.2 13.2h10.8c7.2 0 13.2-6 13.2-13.2V99h6c19.8 0 36-16.2 36-36V45.9c0-15-11.4-25.8-26.4-26.4z" />;
      case 'giraffe':
        return <path d="M75 10c-5 0-10 2-13 6-2 3-3 8-1 12 2 4 6 6 6 15 0 8-4 15-8 20-5 6-12 8-18 8-8 0-15 5-18 12-2 5-2 11 0 16 3 7 9 11 16 11h2v40c0 6 4 10 10 10s10-4 10-10v-30h10v30c0 6 4 10 10 10s10-4 10-10V70h2c8 0 15-7 15-15V35c0-14-11-25-25-25h-8z" />;
      case 'lion':
        return <path d="M90 35c0-19.3-15.7-35-35-35S20 15.7 20 35c0 4.8 1 9.4 2.8 13.6C10.6 53.8 5 66.2 5 80c0 16.6 13.4 30 30 30h40c16.6 0 30-13.4 30-30 0-13.8-5.6-26.2-17.8-31.4C89 54.4 90 49.8 90 35z" />;
      case 'penguin':
        return <path d="M60 10C40 10 25 25 25 50v40c0 15 10 25 25 25h20c15 0 25-10 25-25V50c0-25-15-40-35-40zM40 55c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5zm40 0c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z" />;
      default:
        return null;
    }
  };
  return <svg viewBox="0 0 150 160" className={className} fill={color} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {getPath()}
    </svg>;
}