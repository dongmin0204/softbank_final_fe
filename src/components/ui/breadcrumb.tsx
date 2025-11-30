import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; onClick?: () => void }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm mb-5">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              {item.label}
            </button>
          ) : (
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}