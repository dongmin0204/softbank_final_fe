import React from 'react';

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full">{children}</table>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="border-b" style={{ borderColor: 'var(--border)' }}>{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>{children}</tbody>;
}

export function TableRow({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${
        onClick ? 'cursor-pointer hover:bg-blue-50/30' : ''
      } ${className}`}
      style={{ height: '44px' }}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left py-3 px-6 text-xs font-semibold uppercase tracking-wider ${className}`} style={{ color: 'var(--text-secondary)' }}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 px-6 text-sm ${className}`}>{children}</td>;
}