import React, { useState } from 'react';
import { Breadcrumb } from '../ui/breadcrumb';
import { Badge } from '../Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Download, Play, Copy } from 'lucide-react';
import { RotateCcw, GitBranch } from 'lucide-react';

interface ExecutionDetailProps {
  onNavigate: (page: string, data?: any) => void;
  execution: any;
}

export function ExecutionDetail({ onNavigate, execution }: ExecutionDetailProps) {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'EventOS', onClick: () => onNavigate('dashboard') },
          { label: 'Executions', onClick: () => onNavigate('timeline') },
          { label: `#${execution.id}` }
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1>Execution #{execution.id}</h1>
            <Badge status={execution.status} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            {new Date(execution.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          {execution.status === 'FAILED' && (
            <button
              onClick={() => onNavigate('compare', { original: execution, type: 'replay' })}
              className="px-4 py-2 text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <RotateCcw className="w-4 h-4 inline-block mr-2" />
              Replay
            </button>
          )}
          <button
            onClick={() => onNavigate('compare', { original: execution, type: 'shadow' })}
            className="px-4 py-2 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <GitBranch className="w-4 h-4 inline-block mr-2" />
            Shadow Run
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Function</div>
          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{execution.function}</div>
        </div>
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Duration</div>
          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{execution.duration}ms</div>
        </div>
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Worker</div>
          <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{execution.worker}</div>
        </div>
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Lamport Clock</div>
          <div className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{execution.lamportClock}</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Input */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold">Input</h3>
                <button className="text-xs hover:underline" style={{ color: 'var(--primary)' }}>
                  <Copy className="w-3 h-3 inline-block mr-1" />
                  Copy
                </button>
              </div>
              <div className="p-5">
                <pre className="text-xs overflow-x-auto font-mono" style={{ color: 'var(--text-primary)', backgroundColor: '#F8FAFD', padding: '12px', borderRadius: '8px' }}>
                  {JSON.stringify(execution.input, null, 2)}
                </pre>
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold">Output</h3>
                <button className="text-xs hover:underline" style={{ color: 'var(--primary)' }}>
                  <Copy className="w-3 h-3 inline-block mr-1" />
                  Copy
                </button>
              </div>
              <div className="p-5">
                <pre className={`text-xs overflow-x-auto font-mono ${
                  execution.status === 'FAILED' ? 'text-red-600' : ''
                }`} style={{ backgroundColor: '#F8FAFD', padding: '12px', borderRadius: '8px' }}>
                  {JSON.stringify(execution.output, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-5">
          <div className="bg-gray-900 rounded-2xl overflow-hidden" style={{ border: '1px solid #2A3038' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#2A3038' }}>
              <h3 className="text-sm font-semibold text-white">Execution Logs</h3>
              <button className="text-xs text-blue-400 hover:underline">
                <Download className="w-3 h-3 inline-block mr-1" />
                Download
              </button>
            </div>
            <div className="p-5 font-mono text-xs space-y-1">
              <div className="text-gray-400">[2024-01-15 10:23:45] Function started</div>
              <div className="text-gray-300">[2024-01-15 10:23:45] Processing input...</div>
              <div className="text-gray-300">[2024-01-15 10:23:45] Executing business logic</div>
              {execution.status === 'FAILED' ? (
                <div className="text-red-400">[2024-01-15 10:23:46] ERROR: {execution.output.error}</div>
              ) : (
                <div className="text-green-400">[2024-01-15 10:23:46] Execution completed successfully</div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-5">
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>CPU Usage</div>
              <div className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>42%</div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: '42%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Memory Usage</div>
              <div className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>128 MB</div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: '64%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Network I/O</div>
              <div className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>2.4 MB</div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: '38%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}