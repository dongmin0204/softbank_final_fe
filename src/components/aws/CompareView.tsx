import React from 'react';
import { Breadcrumb } from '../ui/breadcrumb';
import { Badge } from '../Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowRight, TrendingDown } from 'lucide-react';

interface CompareViewProps {
  onNavigate: (page: string, data?: any) => void;
  compareData: any;
}

export function CompareView({ onNavigate, compareData }: CompareViewProps) {
  const { original, type } = compareData;

  // Mock replay data
  const replay = {
    ...original,
    id: original.id + 1000,
    status: 'SUCCESS' as const,
    duration: 115,
    output: { success: true, result: 'Processed successfully' }
  };

  const getVariationReason = () => {
    if (original.status === 'FAILED' && replay.status === 'SUCCESS') {
      return 'Likely cause: Transient infrastructure or runtime variation';
    }
    return 'Performance variation detected';
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'EventOS', onClick: () => onNavigate('dashboard') },
          { label: 'Executions', onClick: () => onNavigate('timeline') },
          { label: `Compare #${original.id}` }
        ]}
      />

      <div>
        <h1>{type === 'replay' ? 'Replay' : 'Shadow'} Comparison</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Compare execution results</p>
      </div>

      {/* Comparison Summary */}
      <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-3 gap-8 items-center">
          <div>
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Original Execution</div>
            <div className="space-y-3">
              <Badge status={original.status} />
              <div style={{ color: 'var(--text-primary)' }}>Duration: <span className="font-semibold">{original.duration}ms</span></div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>#{original.id}</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>

          <div>
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>{type === 'replay' ? 'Replay' : 'Shadow'} Result</div>
            <div className="space-y-3">
              <Badge status={replay.status} />
              <div style={{ color: 'var(--text-primary)' }} className="flex items-center gap-2">
                Duration: <span className="font-semibold">{replay.duration}ms</span>
                {replay.duration < original.duration && (
                  <span className="text-green-600 text-xs flex items-center gap-1 font-semibold">
                    <TrendingDown className="w-3 h-3" />
                    {Math.round((1 - replay.duration / original.duration) * 100)}% faster
                  </span>
                )}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>#{replay.id}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-2 p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <span className="font-semibold">→</span>
            <span className="font-medium text-sm">{getVariationReason()}</span>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <Tabs defaultValue="output">
        <TabsList>
          <TabsTrigger value="output">Output Comparison</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="output" className="mt-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold">Original Output</h3>
              </div>
              <div className="p-5">
                <pre className={`text-xs overflow-x-auto font-mono ${
                  original.status === 'FAILED' ? 'text-red-600' : ''
                }`} style={{ backgroundColor: '#F8FAFD', padding: '12px', borderRadius: '8px' }}>
                  {JSON.stringify(original.output, null, 2)}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold">{type === 'replay' ? 'Replay' : 'Shadow'} Output</h3>
              </div>
              <div className="p-5">
                <pre className="text-xs overflow-x-auto font-mono" style={{ backgroundColor: '#F8FAFD', padding: '12px', borderRadius: '8px' }}>
                  {JSON.stringify(replay.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-5">
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Execution Time</span>
                  <span className="font-semibold text-green-600">
                    {Math.round((1 - replay.duration / original.duration) * 100)}% improvement
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Original</div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-full rounded-full bg-red-500" style={{ width: '100%' }}></div>
                    </div>
                    <div className="text-sm font-medium mt-2" style={{ color: 'var(--text-primary)' }}>{original.duration}ms</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Replay</div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(replay.duration / original.duration) * 100}%`, backgroundColor: 'var(--primary)' }}></div>
                    </div>
                    <div className="text-sm font-medium mt-2" style={{ color: 'var(--text-primary)' }}>{replay.duration}ms</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>CPU Usage</span>
                  <span className="font-semibold text-green-600">42% reduction</span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: '26%', backgroundColor: 'var(--primary)' }}></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Memory Usage</span>
                  <span className="font-semibold text-green-600">28% reduction</span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: '26%', backgroundColor: 'var(--primary)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}