import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};
