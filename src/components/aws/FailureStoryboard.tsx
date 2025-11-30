import React from 'react';
import { Breadcrumb } from '../ui/breadcrumb';
import { AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface FailureStoryboardProps {
  onNavigate: (page: string, data?: any) => void;
  data: any;
}

export function FailureStoryboard({ onNavigate, data }: FailureStoryboardProps) {
  const failures = data.executions.filter((e: any) => e.status === 'FAILED');

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'EventOS', onClick: () => onNavigate('dashboard') },
          { label: 'Failures' }
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1>Failure Storyboard</h1>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              {failures.length} active failures
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Analyze and debug failed executions</p>
        </div>
      </div>

      {failures.length > 0 ? (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execution ID</TableHead>
                <TableHead>Function</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.map((failure: any) => (
                <TableRow key={failure.id}>
                  <TableCell className="font-mono text-gray-600">
                    #{failure.id}
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">
                    {failure.function}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-md">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-600 text-sm font-medium">
                        {failure.output.error || 'Unknown error'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(failure.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-600">
                    {failure.worker}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <button
                        onClick={() => onNavigate('execution', failure)}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm"
                      >
                        View
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => onNavigate('compare', { original: failure, type: 'replay' })}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm"
                      >
                        Replay
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16" style={{ border: '1px solid var(--border)' }}>
          <div className="text-center">
            <div className="text-6xl mb-5">🎉</div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Failures Found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>All executions are running smoothly</p>
          </div>
        </div>
      )}
    </div>
  );
}