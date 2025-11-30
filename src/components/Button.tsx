import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}

// Guidelines 4-2: Button
// Primary:
//   - 배경: var(--primary)
//   - 텍스트: white
//   - radius: 9999px (pill)
//   - hover: opacity 0.9
//   - disabled: opacity 0.5
// Ghost:
//   - 배경: white
//   - border: 1px solid var(--border)
//   - 텍스트: var(--text-secondary)
//   - radius: 12px

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className = '',
  disabled = false
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`transition-all cursor-pointer inline-flex items-center justify-center gap-2 font-medium text-sm ${className}`}
      style={{
        padding: isPrimary ? '10px 20px' : '8px 16px',
        borderRadius: isPrimary ? 'var(--radius-full)' : 'var(--radius-md)',
        backgroundColor: isPrimary ? 'var(--primary)' : 'var(--card-bg)',
        color: isPrimary ? 'white' : 'var(--text-secondary)',
        border: isPrimary ? 'none' : '1px solid var(--border)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (isPrimary) {
            e.currentTarget.style.opacity = '0.9';
          } else {
            e.currentTarget.style.backgroundColor = 'var(--bg)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (isPrimary) {
            e.currentTarget.style.opacity = '1';
          } else {
            e.currentTarget.style.backgroundColor = 'var(--card-bg)';
          }
        }
      }}
    >
      {children}
    </button>
  );
}
