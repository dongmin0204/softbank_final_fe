export type ExecutionType = 'NORMAL' | 'REPLAY' | 'SHADOW';
export type ExecutionStatus = 'SUCCESS' | 'FAILED' | 'RUNNING';

export interface Execution {
  id: number;
  function: string;
  status: ExecutionStatus;
  type: ExecutionType;
  parentExecutionId: number | null;
  duration: number;
  timestamp: string;
  worker: string;
  lamport: number;
  input: Record<string, any>;
  output: Record<string, any>;
  logs: string[];
}

export interface FunctionDef {
  id: string;
  name: string;
  runtime: string;
  currentVersion: string;
  executions24h: number;
  failures24h: number;
  active: boolean;
}

export const mockData = {
  functions: [
    {
      id: 'fn-1',
      name: 'resizeImage',
      runtime: 'Node.js 18',
      currentVersion: 'v1.2.3',
      executions24h: 1247,
      failures24h: 3,
      active: true,
    },
    {
      id: 'fn-2',
      name: 'processPayment',
      runtime: 'Python 3.11',
      currentVersion: 'v2.0.1',
      executions24h: 892,
      failures24h: 0,
      active: true,
    },
    {
      id: 'fn-3',
      name: 'sendNotification',
      runtime: 'Node.js 20',
      currentVersion: 'v1.5.0',
      executions24h: 2103,
      failures24h: 5,
      active: true,
    },
    {
      id: 'fn-4',
      name: 'generateReport',
      runtime: 'Python 3.9',
      currentVersion: 'v3.1.2',
      executions24h: 456,
      failures24h: 1,
      active: true,
    },
    {
      id: 'fn-5',
      name: 'transcodeVideo',
      runtime: 'Go 1.20',
      currentVersion: 'v1.0.8',
      executions24h: 234,
      failures24h: 0,
      active: false,
    },
  ] as FunctionDef[],
  executions: [
    // Normal executions
    {
      id: 1001,
      function: 'resizeImage',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 142,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      worker: 'worker-a3f2',
      lamport: 1523,
      input: { imageUrl: 'https://example.com/photo.jpg', width: 800, height: 600 },
      output: { success: true, url: 'https://cdn.example.com/resized.jpg' },
      logs: [
        '[INFO] Starting image resize operation',
        '[INFO] Downloading image from source',
        '[INFO] Resizing to 800x600',
        '[INFO] Uploading to CDN',
        '[INFO] Operation completed successfully'
      ]
    },
    {
      id: 1002,
      function: 'processPayment',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 287,
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      worker: 'worker-b7e1',
      lamport: 1524,
      input: { amount: 49.99, currency: 'USD', customerId: 'cust_123' },
      output: { success: true, transactionId: 'txn_abc123', status: 'completed' },
      logs: [
        '[INFO] Processing payment request',
        '[INFO] Validating payment details',
        '[INFO] Contacting payment gateway',
        '[INFO] Payment authorized',
        '[INFO] Transaction completed'
      ]
    },
    {
      id: 1003,
      function: 'sendNotification',
      status: 'FAILED' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 523,
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      worker: 'worker-c4d9',
      lamport: 1525,
      input: { userId: 'user_456', message: 'Your order has shipped', channel: 'email' },
      output: { error: 'SMTP connection timeout', code: 'TIMEOUT_ERROR' },
      logs: [
        '[INFO] Starting notification send',
        '[INFO] Connecting to SMTP server',
        '[WARN] Connection taking longer than expected',
        '[ERROR] SMTP connection timeout after 500ms',
        '[ERROR] Failed to send notification'
      ]
    },
    // Replay of the failed notification - now SUCCESS
    {
      id: 1013,
      function: 'sendNotification',
      status: 'SUCCESS' as const,
      type: 'REPLAY' as ExecutionType,
      parentExecutionId: 1003,
      duration: 98,
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      worker: 'worker-c4d9',
      lamport: 1535,
      input: { userId: 'user_456', message: 'Your order has shipped', channel: 'email' },
      output: { success: true, messageId: 'msg_retry_001' },
      logs: [
        '[INFO] Starting notification send (REPLAY)',
        '[INFO] Connecting to SMTP server',
        '[INFO] Message sent successfully',
        '[INFO] Notification delivered'
      ]
    },
    {
      id: 1004,
      function: 'resizeImage',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 156,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      worker: 'worker-a3f2',
      lamport: 1526,
      input: { imageUrl: 'https://example.com/banner.png', width: 1920, height: 1080 },
      output: { success: true, url: 'https://cdn.example.com/banner-hd.png' },
      logs: [
        '[INFO] Starting image resize operation',
        '[INFO] Downloading image from source',
        '[INFO] Resizing to 1920x1080',
        '[INFO] Uploading to CDN',
        '[INFO] Operation completed successfully'
      ]
    },
    {
      id: 1005,
      function: 'generateReport',
      status: 'FAILED' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 2341,
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      worker: 'worker-e8k2',
      lamport: 1527,
      input: { reportType: 'monthly', format: 'pdf', userId: 'admin_001' },
      output: { error: 'Database query timeout', code: 'DB_TIMEOUT' },
      logs: [
        '[INFO] Starting report generation',
        '[INFO] Querying database for data',
        '[WARN] Large dataset detected',
        '[ERROR] Query exceeded 2000ms timeout',
        '[ERROR] Report generation failed'
      ]
    },
    // Shadow run for generateReport
    {
      id: 1015,
      function: 'generateReport',
      status: 'FAILED' as const,
      type: 'SHADOW' as ExecutionType,
      parentExecutionId: 1005,
      duration: 2456,
      timestamp: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
      worker: 'worker-f9k3',
      lamport: 1537,
      input: { reportType: 'monthly', format: 'pdf', userId: 'admin_001' },
      output: { error: 'Database query timeout', code: 'DB_TIMEOUT' },
      logs: [
        '[INFO] Starting report generation (SHADOW)',
        '[INFO] Querying database for data',
        '[WARN] Large dataset detected',
        '[ERROR] Query exceeded 2000ms timeout',
        '[ERROR] Report generation failed'
      ]
    },
    {
      id: 1006,
      function: 'processPayment',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 195,
      timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      worker: 'worker-b7e1',
      lamport: 1528,
      input: { amount: 129.99, currency: 'EUR', customerId: 'cust_789' },
      output: { success: true, transactionId: 'txn_xyz789', status: 'completed' },
      logs: [
        '[INFO] Processing payment request',
        '[INFO] Validating payment details',
        '[INFO] Contacting payment gateway',
        '[INFO] Payment authorized',
        '[INFO] Transaction completed'
      ]
    },
    // Shadow run for processPayment comparison
    {
      id: 1016,
      function: 'processPayment',
      status: 'SUCCESS' as const,
      type: 'SHADOW' as ExecutionType,
      parentExecutionId: 1006,
      duration: 203,
      timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
      worker: 'worker-b7e2',
      lamport: 1538,
      input: { amount: 129.99, currency: 'EUR', customerId: 'cust_789' },
      output: { success: true, transactionId: 'txn_xyz790', status: 'completed' },
      logs: [
        '[INFO] Processing payment request (SHADOW)',
        '[INFO] Validating payment details',
        '[INFO] Contacting payment gateway',
        '[INFO] Payment authorized',
        '[INFO] Transaction completed'
      ]
    },
    {
      id: 1007,
      function: 'sendNotification',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 98,
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      worker: 'worker-c4d9',
      lamport: 1529,
      input: { userId: 'user_789', message: 'Welcome to our platform!', channel: 'sms' },
      output: { success: true, messageId: 'msg_def456' },
      logs: [
        '[INFO] Starting notification send',
        '[INFO] Connecting to SMS gateway',
        '[INFO] Message sent successfully',
        '[INFO] Notification delivered'
      ]
    },
    {
      id: 1008,
      function: 'resizeImage',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 134,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      worker: 'worker-a3f2',
      lamport: 1530,
      input: { imageUrl: 'https://example.com/profile.jpg', width: 256, height: 256 },
      output: { success: true, url: 'https://cdn.example.com/profile-thumb.jpg' },
      logs: [
        '[INFO] Starting image resize operation',
        '[INFO] Downloading image from source',
        '[INFO] Resizing to 256x256',
        '[INFO] Uploading to CDN',
        '[INFO] Operation completed successfully'
      ]
    },
    // Replay for resizeImage testing
    {
      id: 1018,
      function: 'resizeImage',
      status: 'SUCCESS' as const,
      type: 'REPLAY' as ExecutionType,
      parentExecutionId: 1008,
      duration: 128,
      timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      worker: 'worker-a3f2',
      lamport: 1540,
      input: { imageUrl: 'https://example.com/profile.jpg', width: 256, height: 256 },
      output: { success: true, url: 'https://cdn.example.com/profile-thumb.jpg' },
      logs: [
        '[INFO] Starting image resize operation (REPLAY)',
        '[INFO] Downloading image from source',
        '[INFO] Resizing to 256x256',
        '[INFO] Uploading to CDN',
        '[INFO] Operation completed successfully'
      ]
    },
    {
      id: 1009,
      function: 'generateReport',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 1876,
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      worker: 'worker-e8k2',
      lamport: 1531,
      input: { reportType: 'weekly', format: 'csv', userId: 'admin_002' },
      output: { success: true, fileUrl: 'https://storage.example.com/reports/week-48.csv' },
      logs: [
        '[INFO] Starting report generation',
        '[INFO] Querying database for data',
        '[INFO] Processing 1,234 records',
        '[INFO] Formatting as CSV',
        '[INFO] Report generated successfully'
      ]
    },
    {
      id: 1010,
      function: 'sendNotification',
      status: 'FAILED' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 412,
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      worker: 'worker-c4d9',
      lamport: 1532,
      input: { userId: 'user_321', message: 'Password reset requested', channel: 'push' },
      output: { error: 'Invalid device token', code: 'INVALID_TOKEN' },
      logs: [
        '[INFO] Starting notification send',
        '[INFO] Connecting to push notification service',
        '[WARN] Device token validation failed',
        '[ERROR] Invalid device token for user',
        '[ERROR] Notification send failed'
      ]
    },
    // Replay of failed push notification - still failed
    {
      id: 1020,
      function: 'sendNotification',
      status: 'FAILED' as const,
      type: 'REPLAY' as ExecutionType,
      parentExecutionId: 1010,
      duration: 398,
      timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
      worker: 'worker-c4d9',
      lamport: 1542,
      input: { userId: 'user_321', message: 'Password reset requested', channel: 'push' },
      output: { error: 'Invalid device token', code: 'INVALID_TOKEN' },
      logs: [
        '[INFO] Starting notification send (REPLAY)',
        '[INFO] Connecting to push notification service',
        '[WARN] Device token validation failed',
        '[ERROR] Invalid device token for user',
        '[ERROR] Notification send failed'
      ]
    },
    {
      id: 1011,
      function: 'processPayment',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 223,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      worker: 'worker-b7e1',
      lamport: 1533,
      input: { amount: 9.99, currency: 'GBP', customerId: 'cust_456' },
      output: { success: true, transactionId: 'txn_ghi789', status: 'completed' },
      logs: [
        '[INFO] Processing payment request',
        '[INFO] Validating payment details',
        '[INFO] Contacting payment gateway',
        '[INFO] Payment authorized',
        '[INFO] Transaction completed'
      ]
    },
    {
      id: 1012,
      function: 'resizeImage',
      status: 'SUCCESS' as const,
      type: 'NORMAL' as ExecutionType,
      parentExecutionId: null,
      duration: 167,
      timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      worker: 'worker-a3f2',
      lamport: 1534,
      input: { imageUrl: 'https://example.com/product.jpg', width: 600, height: 600 },
      output: { success: true, url: 'https://cdn.example.com/product-med.jpg' },
      logs: [
        '[INFO] Starting image resize operation',
        '[INFO] Downloading image from source',
        '[INFO] Resizing to 600x600',
        '[INFO] Uploading to CDN',
        '[INFO] Operation completed successfully'
      ]
    }
  ] as Execution[]
};

// Helper functions for statistics
export function getExecutionStats(executions: Execution[]) {
  const total = executions.length;
  const normal = executions.filter(e => e.type === 'NORMAL').length;
  const replay = executions.filter(e => e.type === 'REPLAY').length;
  const shadow = executions.filter(e => e.type === 'SHADOW').length;
  const success = executions.filter(e => e.status === 'SUCCESS').length;
  const failed = executions.filter(e => e.status === 'FAILED').length;

  return {
    total,
    normal,
    replay,
    shadow,
    success,
    failed,
    replayRate: total > 0 ? Math.round((replay / total) * 100) : 0,
    shadowRate: total > 0 ? Math.round((shadow / total) * 100) : 0,
    successRate: total > 0 ? Math.round((success / total) * 100) : 0,
    debugRate: total > 0 ? Math.round(((replay + shadow) / total) * 100) : 0,
  };
}
