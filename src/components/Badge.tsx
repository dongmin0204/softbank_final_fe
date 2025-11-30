interface BadgeProps {
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'REPLAY' | 'SHADOW';
  size?: 'sm' | 'md';
}

// Guidelines 4-3: Badge (Status Chip)
// - radius: 8px
// - SUCCESS: 연한 초록 배경 + 초록 텍스트
// - FAILED: 연한 빨강 배경 + 빨강 텍스트
// - REPLAY: 연파랑 배경 + 파랑 텍스트
// - SHADOW: 연파랑 배경 + 짙은 파랑 텍스트

const statusConfig = {
  SUCCESS: { 
    bg: '#E8F5EC', 
    text: 'var(--success)',
    dot: 'var(--success)'
  },
  FAILED: { 
    bg: '#FEECED', 
    text: 'var(--error)',
    dot: 'var(--error)'
  },
  RUNNING: { 
    bg: 'var(--bg)', 
    text: 'var(--text-secondary)',
    dot: 'var(--text-secondary)'
  },
  REPLAY: {
    bg: 'var(--primary-light)',
    text: 'var(--primary)',
    dot: 'var(--primary)'
  },
  SHADOW: {
    bg: 'var(--primary-light)',
    text: 'var(--primary-dark)',
    dot: 'var(--primary-dark)'
  }
};

export function Badge({ status, size = 'md' }: BadgeProps) {
  const config = statusConfig[status];
  const padding = size === 'sm' ? '4px 8px' : '6px 12px';
  const fontSize = size === 'sm' ? '12px' : '13px';

  return (
    <span 
      className="inline-flex items-center gap-1.5 font-medium"
      style={{
        padding,
        fontSize,
        borderRadius: 'var(--radius-sm)',
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dot }}
      />
      {status}
    </span>
  );
}
