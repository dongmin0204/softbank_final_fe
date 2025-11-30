import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

// Guidelines 4-1: Card
// - background: white
// - border: 1px solid var(--border)
// - radius: 16px (rounded-2xl)
// - padding: 20px
// - shadow 없음

export function Card({ children, className = '', noPadding = false }: CardProps) {
  return (
    <div 
      className={className}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: noPadding ? 0 : 'var(--space-20)'
      }}
    >
      {children}
    </div>
  );
}
