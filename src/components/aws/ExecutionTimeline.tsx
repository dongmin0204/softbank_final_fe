import { useState, useEffect, useMemo } from 'react';
import { Breadcrumb } from '../ui/breadcrumb';
import { Badge } from '../Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Filter, RefreshCw, Clock, Zap, RotateCcw, GitBranch } from 'lucide-react';
import { type Execution, type ExecutionType } from '../../data/mockData';

interface ExecutionTimelineProps {
  onNavigate: (page: string, data?: any) => void;
  data: any;
}

type TimeRange = '5m' | '10m' | '1h' | '6h' | '24h';

// Get execution marker style based on status and type
const getExecutionStyle = (status: string, type: ExecutionType) => {
  const statusColors = {
    SUCCESS: { from: '#22C55E', to: '#16A34A' },
    FAILED: { from: '#EF4444', to: '#DC2626' },
    RUNNING: { from: '#9CA3AF', to: '#6B7280' },
  };

  if (type === 'REPLAY') {
    return {
      background: `linear-gradient(135deg, #60A5FA, #2563EB)`,
      border: '2px solid #BFDBFE',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)',
    };
  }
  
  if (type === 'SHADOW') {
    return {
      background: status === 'SUCCESS' 
        ? 'linear-gradient(135deg, #22C55E, #16A34A)'
        : status === 'FAILED' 
        ? 'linear-gradient(135deg, #EF4444, #DC2626)'
        : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
      border: '2px dashed #2563EB',
      boxShadow: 'none',
    };
  }

  const colors = statusColors[status as keyof typeof statusColors] || statusColors.RUNNING;
  return {
    background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
    border: 'none',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  };
};

export function ExecutionTimeline({ onNavigate, data }: ExecutionTimelineProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [hoveredExec, setHoveredExec] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | ExecutionType>('ALL');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeRangeConfig = {
    '5m': { hours: 5 / 60, slots: 10, slotMinutes: 0.5, label: '5분' },
    '10m': { hours: 10 / 60, slots: 10, slotMinutes: 1, label: '10분' },
    '1h': { hours: 1, slots: 12, slotMinutes: 5, label: '1시간' },
    '6h': { hours: 6, slots: 12, slotMinutes: 30, label: '6시간' },
    '24h': { hours: 24, slots: 12, slotMinutes: 120, label: '24시간' },
  };

  const config = timeRangeConfig[timeRange];

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = currentTime.getTime();
    const startTime = now - (config.hours * 60 * 60 * 1000);
    
    for (let i = 0; i <= config.slots; i++) {
      const slotTime = new Date(startTime + (i * config.slotMinutes * 60 * 1000));
      slots.push({
        time: slotTime,
        label: slotTime.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        isNow: i === config.slots,
      });
    }
    return slots;
  }, [currentTime, config]);

  const getExecutionPosition = (timestamp: string) => {
    const execTime = new Date(timestamp).getTime();
    const now = currentTime.getTime();
    const startTime = now - (config.hours * 60 * 60 * 1000);
    const totalDuration = config.hours * 60 * 60 * 1000;
    
    const position = ((execTime - startTime) / totalDuration) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const getVisibleExecutions = (functionName: string) => {
    const now = currentTime.getTime();
    const startTime = now - (config.hours * 60 * 60 * 1000);
    
    return data.executions
      .filter((e: Execution) => {
        const execTime = new Date(e.timestamp).getTime();
        const matchesTime = e.function === functionName && execTime >= startTime && execTime <= now;
        const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
        return matchesTime && matchesType;
      })
      .sort((a: Execution, b: Execution) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getExecutionWidth = (duration: number) => {
    const maxDuration = 3000;
    const minWidth = 8;
    const maxWidth = 60;
    const width = minWidth + ((Math.min(duration, maxDuration) / maxDuration) * (maxWidth - minWidth));
    return width;
  };

  const formatRelativeTime = (timestamp: string) => {
    const diff = currentTime.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes % 60}분 전`;
    }
    return `${minutes}분 전`;
  };

  const getTypeBadge = (type: ExecutionType) => {
    if (type === 'REPLAY') {
      return (
        <span 
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium" 
          style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}
        >
          <RotateCcw className="w-3 h-3" />
          Replay
        </span>
      );
    }
    if (type === 'SHADOW') {
      return (
        <span 
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium" 
          style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-sm)' }}
        >
          <GitBranch className="w-3 h-3" />
          Shadow
        </span>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: 'var(--space-24)' }}>
      <div style={{ marginBottom: 'var(--space-24)' }}>
        <Breadcrumb
          items={[
            { label: 'EventOS', onClick: () => onNavigate('dashboard') },
            { label: 'Timeline' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-24)' }}>
        <div>
          <h1>Execution Timeline</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{data.executions.length} total executions</p>
        </div>
        <div className="flex" style={{ gap: 'var(--space-12)' }}>
          <button 
            className="flex items-center font-medium text-sm transition-colors"
            style={{ 
              padding: '8px 16px',
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)' 
            }}
          >
            <Filter className="w-4 h-4" style={{ marginRight: '8px' }} />
            Filter
          </button>
          <button 
            className="flex items-center font-medium text-sm transition-colors"
            style={{ 
              padding: '8px 16px',
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)' 
            }}
          >
            <RefreshCw className="w-4 h-4" style={{ marginRight: '8px' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Time Schedule View */}
      <div 
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-24)',
          marginBottom: 'var(--space-24)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-24)' }}>
          <div className="flex items-center" style={{ gap: 'var(--space-12)' }}>
            <div 
              className="flex items-center"
              style={{ 
                gap: 'var(--space-8)', 
                padding: '8px 16px',
                backgroundColor: 'var(--primary-light)', 
                borderRadius: 'var(--radius-md)' 
              }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span className="font-semibold" style={{ color: 'var(--primary-dark)' }}>
                현재 시간: {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
          
          {/* Time range selector */}
          <div 
            className="flex items-center"
            style={{ 
              gap: '4px', 
              padding: '4px',
              backgroundColor: 'var(--bg)', 
              borderRadius: 'var(--radius-md)' 
            }}
          >
            {(Object.keys(timeRangeConfig) as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className="text-sm font-medium transition-all"
                style={{ 
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: timeRange === range ? 'var(--card-bg)' : 'transparent',
                  color: timeRange === range ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: timeRange === range ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {timeRangeConfig[range].label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="flex items-center" style={{ gap: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Type:</span>
          {(['ALL', 'NORMAL', 'REPLAY', 'SHADOW'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className="text-xs font-medium transition-all"
              style={{ 
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: typeFilter === type 
                  ? type === 'REPLAY' ? 'var(--primary)' 
                  : type === 'SHADOW' ? 'var(--primary-dark)' 
                  : 'var(--text-primary)'
                  : 'var(--bg)',
                color: typeFilter === type ? 'white' : 'var(--text-secondary)'
              }}
            >
              {type === 'ALL' && 'All'}
              {type === 'NORMAL' && 'Normal'}
              {type === 'REPLAY' && (
                <span className="flex items-center" style={{ gap: '4px' }}>
                  <RotateCcw className="w-3 h-3" />
                  Replay
                </span>
              )}
              {type === 'SHADOW' && (
                <span className="flex items-center" style={{ gap: '4px' }}>
                  <GitBranch className="w-3 h-3" />
                  Shadow
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Time axis header */}
          <div className="flex" style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{ width: '160px', flexShrink: 0 }} />
            <div className="flex-1 relative">
              <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                {timeSlots.map((slot, i) => (
                  <div 
                    key={i} 
                    className="text-center"
                    style={{ 
                      fontWeight: slot.isNow ? 600 : 400,
                      color: slot.isNow ? 'var(--primary)' : 'var(--text-secondary)',
                      width: i === 0 || i === timeSlots.length - 1 ? 'auto' : '1px'
                    }}
                  >
                    {slot.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time grid lines */}
          <div className="flex">
            <div style={{ width: '160px', flexShrink: 0 }} />
            <div className="flex-1 relative" style={{ height: '8px', marginBottom: 'var(--space-8)' }}>
              <div className="absolute inset-0 flex justify-between">
                {timeSlots.map((slot, i) => (
                  <div 
                    key={i}
                    style={{ 
                      width: '1px', 
                      height: slot.isNow ? '100%' : '50%',
                      backgroundColor: slot.isNow ? 'var(--primary)' : 'var(--border)'
                    }}
                  />
                ))}
              </div>
              {/* Now indicator */}
              <div 
                className="absolute animate-pulse"
                style={{ 
                  right: 0, 
                  top: '-4px', 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: 'var(--primary)', 
                  borderRadius: 'var(--radius-full)' 
                }}
              />
            </div>
          </div>

          {/* Function rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {data.functions.map((fn: any) => {
              const fnExecutions = getVisibleExecutions(fn.name);
              const successCount = fnExecutions.filter((e: Execution) => e.status === 'SUCCESS').length;
              const failedCount = fnExecutions.filter((e: Execution) => e.status === 'FAILED').length;
              const replayCount = fnExecutions.filter((e: Execution) => e.type === 'REPLAY').length;
              const shadowCount = fnExecutions.filter((e: Execution) => e.type === 'SHADOW').length;
              
              return (
                <div key={fn.id} className="flex items-center group">
                  {/* Function name and stats */}
                  <div style={{ width: '160px', flexShrink: 0, paddingRight: 'var(--space-16)' }}>
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{fn.name}</div>
                    <div className="flex items-center text-xs" style={{ gap: 'var(--space-8)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      <span className="flex items-center" style={{ gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                        {successCount}
                      </span>
                      <span className="flex items-center" style={{ gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--error)' }} />
                        {failedCount}
                      </span>
                      {replayCount > 0 && (
                        <span className="flex items-center" style={{ gap: '4px', color: 'var(--primary)' }}>
                          <RotateCcw className="w-2.5 h-2.5" />
                          {replayCount}
                        </span>
                      )}
                      {shadowCount > 0 && (
                        <span className="flex items-center" style={{ gap: '4px', color: 'var(--primary-dark)' }}>
                          <GitBranch className="w-2.5 h-2.5" />
                          {shadowCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline bar */}
                  <div 
                    className="flex-1 relative overflow-hidden transition-colors"
                    style={{ 
                      height: '48px',
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none">
                      {timeSlots.map((_, i) => (
                        <div key={i} style={{ width: '1px', height: '100%', backgroundColor: 'var(--border)', opacity: 0.5 }} />
                      ))}
                    </div>
                    
                    {/* Now line */}
                    <div 
                      className="absolute top-0 bottom-0 z-10"
                      style={{ right: 0, width: '2px', backgroundColor: 'var(--primary)', opacity: 0.6 }}
                    />
                    
                    {/* Execution markers */}
                    {fnExecutions.map((exec: Execution) => {
                      const position = getExecutionPosition(exec.timestamp);
                      const width = getExecutionWidth(exec.duration);
                      const isHovered = hoveredExec?.id === exec.id;
                      const style = getExecutionStyle(exec.status, exec.type);
                      
                      return (
                        <div
                          key={exec.id}
                          className="absolute cursor-pointer transition-all z-20"
                          style={{ 
                            left: `${position}%`,
                            top: '50%',
                            transform: `translateX(-50%) translateY(-50%) ${isHovered ? 'scale(1.2)' : ''}`,
                          }}
                          onMouseEnter={() => setHoveredExec(exec)}
                          onMouseLeave={() => setHoveredExec(null)}
                          onClick={() => onNavigate('execution', exec)}
                        >
                          <div
                            className="flex items-center justify-center transition-all"
                            style={{ 
                              height: '32px',
                              width: `${width}px`, 
                              minWidth: '8px',
                              borderRadius: 'var(--radius-sm)',
                              background: style.background,
                              border: style.border,
                              boxShadow: style.boxShadow,
                            }}
                          >
                            {width >= 20 && exec.type === 'NORMAL' && (
                              <Zap className="w-3 h-3 text-white opacity-80" />
                            )}
                            {width >= 20 && exec.type === 'REPLAY' && (
                              <RotateCcw className="w-3 h-3 text-white opacity-90" />
                            )}
                            {width >= 20 && exec.type === 'SHADOW' && (
                              <GitBranch className="w-3 h-3 text-white opacity-90" />
                            )}
                          </div>
                          
                          {/* Tooltip */}
                          {isHovered && (
                            <div 
                              className="absolute z-50"
                              style={{ 
                                bottom: '100%', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                marginBottom: '8px' 
                              }}
                            >
                              <div 
                                className="text-xs shadow-lg whitespace-nowrap"
                                style={{ 
                                  backgroundColor: 'var(--text-primary)', 
                                  color: 'white', 
                                  borderRadius: 'var(--radius-md)',
                                  padding: '12px 16px'
                                }}
                              >
                                <div className="flex items-center" style={{ gap: '8px', marginBottom: '4px' }}>
                                  <span className="font-semibold">#{exec.id}</span>
                                  {getTypeBadge(exec.type)}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{exec.function}</div>
                                <div className="flex items-center" style={{ gap: '12px', color: 'rgba(255,255,255,0.8)' }}>
                                  <span>{exec.duration}ms</span>
                                  <span>{formatRelativeTime(exec.timestamp)}</span>
                                </div>
                                {exec.parentExecutionId && (
                                  <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '4px', fontSize: '11px' }}>
                                    원본: #{exec.parentExecutionId}
                                  </div>
                                )}
                                <div style={{ marginTop: '8px' }}>
                                  <Badge status={exec.status} size="sm" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Empty state */}
                    {fnExecutions.length === 0 && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        이 시간대에 실행 없음
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div 
          className="flex items-center justify-between flex-wrap"
          style={{ 
            marginTop: 'var(--space-24)', 
            paddingTop: 'var(--space-20)', 
            borderTop: '1px solid var(--border)' 
          }}
        >
          <div className="flex text-xs flex-wrap" style={{ gap: 'var(--space-16)', color: 'var(--text-secondary)' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div style={{ width: '24px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #22C55E, #16A34A)' }} />
              <span>Success</span>
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div style={{ width: '24px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #EF4444, #DC2626)' }} />
              <span>Failed</span>
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div style={{ 
                width: '24px', 
                height: '16px', 
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #60A5FA, #2563EB)',
                border: '2px solid #BFDBFE',
              }} />
              <span>Replay</span>
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div style={{ 
                width: '24px', 
                height: '16px', 
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                border: '2px dashed #2563EB'
              }} />
              <span>Shadow</span>
            </div>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div 
                className="animate-pulse"
                style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}
              />
              <span>현재 시간</span>
            </div>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            바 길이 = 실행 시간 (최대 3초 기준)
          </div>
        </div>
      </div>

      {/* Recent Executions Summary */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 'var(--space-16)',
          marginBottom: 'var(--space-24)'
        }}
      >
        {['1분', '5분', '15분', '1시간'].map((period, i) => {
          const minutes = [1, 5, 15, 60][i];
          const cutoff = new Date(currentTime.getTime() - minutes * 60 * 1000);
          const recentExecs = data.executions.filter((e: Execution) => new Date(e.timestamp) >= cutoff);
          const successRate = recentExecs.length > 0 
            ? Math.round((recentExecs.filter((e: Execution) => e.status === 'SUCCESS').length / recentExecs.length) * 100)
            : 100;
          
          return (
            <div 
              key={period} 
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-16)'
              }}
            >
              <div className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>최근 {period}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{recentExecs.length}</div>
                <div 
                  className="text-sm font-medium"
                  style={{ 
                    color: successRate >= 90 ? 'var(--success)' : successRate >= 70 ? 'var(--warning)' : 'var(--error)'
                  }}
                >
                  {successRate}% 성공
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table View */}
      <div 
        className="overflow-hidden"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div 
          className="flex items-center justify-between"
          style={{ 
            padding: 'var(--space-20)', 
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <h3>All Executions</h3>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>클릭하여 상세 보기</span>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Execution ID</TableHead>
              <TableHead>Function</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Time Ago</TableHead>
              <TableHead>Worker</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.executions.map((exec: Execution) => (
              <TableRow
                key={exec.id}
                onClick={() => onNavigate('execution', exec)}
              >
                <TableCell>
                  <Badge status={exec.status} size="sm" />
                </TableCell>
                <TableCell>
                  {exec.type === 'REPLAY' && (
                    <span 
                      className="inline-flex items-center text-xs font-medium" 
                      style={{ 
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: 'var(--primary-light)', 
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <RotateCcw className="w-3 h-3" />
                      Replay
                    </span>
                  )}
                  {exec.type === 'SHADOW' && (
                    <span 
                      className="inline-flex items-center text-xs font-medium" 
                      style={{ 
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: 'var(--primary-light)', 
                        color: 'var(--primary-dark)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <GitBranch className="w-3 h-3" />
                      Shadow
                    </span>
                  )}
                  {exec.type === 'NORMAL' && (
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Normal</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                    #{exec.id}
                    {exec.parentExecutionId && (
                      <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                        ← #{exec.parentExecutionId}
                      </span>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{exec.function}</span>
                </TableCell>
                <TableCell>
                  <span style={{ color: 'var(--text-secondary)' }}>{exec.duration}ms</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatRelativeTime(exec.timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {exec.worker}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
