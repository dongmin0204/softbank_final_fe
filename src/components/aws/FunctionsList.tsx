import React, { useState } from 'react';
import { Breadcrumb } from '../ui/breadcrumb';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface FunctionsListProps {
  onNavigate: (page: string, data?: any) => void;
  data: any;
}

export function FunctionsList({ onNavigate, data }: FunctionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredFunctions = data.functions.filter((fn: any) =>
    fn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb 
        items={[
          { label: 'EventOS', onClick: () => onNavigate('dashboard') }, 
          { label: 'Functions' }
        ]} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h1>Functions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{filteredFunctions.length} total functions</p>
        </div>
        <button
          onClick={() => onNavigate('deploy')}
          className="px-5 py-2.5 text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Deploy Function
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {['All', 'Node.js', 'Python', 'Go'].map((runtime) => (
          <button
            key={runtime}
            onClick={() => setFilter(runtime)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === runtime
                ? 'text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
            style={{
              backgroundColor: filter === runtime ? 'var(--primary)' : 'white',
              color: filter === runtime ? 'white' : 'var(--text-secondary)',
              border: filter === runtime ? 'none' : '1px solid var(--border)'
            }}
          >
            {runtime}
          </button>
        ))}
      </div>

      {/* Functions Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Function Name</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Executions (24h)</TableHead>
              <TableHead>Failures (24h)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFunctions.map((fn: any) => (
              <TableRow key={fn.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {fn.active && (
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    )}
                    <span className="text-gray-900 font-medium">{fn.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{fn.runtime}</TableCell>
                <TableCell className="font-mono text-gray-600">{fn.currentVersion}</TableCell>
                <TableCell className="text-gray-900 font-medium">{fn.executions24h}</TableCell>
                <TableCell>
                  <span className={fn.failures24h > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                    {fn.failures24h}
                  </span>
                </TableCell>
                <TableCell>
                  {fn.active ? (
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('timeline')}
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm"
                    >
                      View
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => onNavigate('deploy')}
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-sm"
                    >
                      Deploy
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}