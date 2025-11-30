import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Breadcrumb } from '../ui/breadcrumb';
import { 
  Play, 
  Trash2, 
  Plus, 
  FileCode, 
  Terminal,
  ChevronDown,
  Rocket,
  FolderOpen,
  File,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DeployFunctionProps {
  onNavigate: (page: string, data?: any) => void;
}

type Runtime = 'node20' | 'python312' | 'go121';

const RUNTIME_OPTIONS: { value: Runtime; label: string; extension: string; icon: string }[] = [
  { value: 'node20', label: 'Node.js 20', extension: 'js', icon: '🟢' },
  { value: 'python312', label: 'Python 3.12', extension: 'py', icon: '🐍' },
  { value: 'go121', label: 'Go 1.21', extension: 'go', icon: '🔵' },
];

const DEFAULT_CODE: Record<Runtime, string> = {
  node20: `// EventOS Function - Node.js 20
// Handler function for your serverless function

export async function handler(event, context) {
  console.log('Received event:', event);
  
  // Your business logic here
  const name = event.name || 'World';
  const result = {
    message: \`Hello, \${name}!\`,
    timestamp: new Date().toISOString(),
    input: event
  };
  
  console.log('Processing complete');
  
  return {
    statusCode: 200,
    body: result
  };
}
`,
  python312: `# EventOS Function - Python 3.12
# Handler function for your serverless function

import json
from datetime import datetime

def handler(event, context):
    print(f"Received event: {event}")
    
    # Your business logic here
    name = event.get("name", "World")
    result = {
        "message": f"Hello, {name}!",
        "timestamp": datetime.now().isoformat(),
        "input": event
    }
    
    print("Processing complete")
    
    return {
        "statusCode": 200,
        "body": result
    }
`,
  go121: `// EventOS Function - Go 1.21
// Handler function for your serverless function

package main

import (
    "encoding/json"
    "fmt"
    "time"
)

type Response struct {
    StatusCode int         \`json:"statusCode"\`
    Body       interface{} \`json:"body"\`
}

func Handler(event map[string]interface{}) Response {
    fmt.Printf("Received event: %+v\\n", event)
    
    // Your business logic here
    name := "World"
    if n, ok := event["name"].(string); ok {
        name = n
    }
    
    result := map[string]interface{}{
        "message":   fmt.Sprintf("Hello, %s!", name),
        "timestamp": time.Now().Format(time.RFC3339),
        "input":     event,
    }
    
    fmt.Println("Processing complete")
    
    return Response{
        StatusCode: 200,
        Body:       result,
    }
}
`,
};

const LANGUAGE_MAP: Record<Runtime, string> = {
  node20: 'javascript',
  python312: 'python',
  go121: 'go',
};

// Simple code analyzer to extract information from the code
function analyzeCode(code: string, runtime: Runtime): {
  consoleLogs: string[];
  returnValue: any;
  hasError: boolean;
  errorMessage?: string;
} {
  const consoleLogs: string[] = [];
  let returnValue: any = null;
  let hasError = false;
  let errorMessage: string | undefined;

  try {
    // Extract console.log/print statements
    if (runtime === 'node20') {
      const logMatches = code.matchAll(/console\.log\(['"](.*?)['"]/g);
      for (const match of logMatches) {
        consoleLogs.push(match[1]);
      }
      
      // Check for message pattern
      const messageMatch = code.match(/message:\s*[`'"](.*?)[`'"]/);
      if (messageMatch) {
        returnValue = { message: messageMatch[1].replace(/\$\{.*?\}/g, '') };
      }
      
      // Check for statusCode
      const statusMatch = code.match(/statusCode:\s*(\d+)/);
      if (statusMatch) {
        returnValue = { ...returnValue, statusCode: parseInt(statusMatch[1]) };
      }
    } else if (runtime === 'python312') {
      const printMatches = code.matchAll(/print\([f]?['"](.*?)['"]/g);
      for (const match of printMatches) {
        consoleLogs.push(match[1].replace(/\{.*?\}/g, ''));
      }
      
      const messageMatch = code.match(/"message":\s*f?['"](.*?)['"]/);
      if (messageMatch) {
        returnValue = { message: messageMatch[1].replace(/\{.*?\}/g, '') };
      }
    } else if (runtime === 'go121') {
      const fmtMatches = code.matchAll(/fmt\.Print(?:ln|f)?\(['"](.*?)['"]/g);
      for (const match of fmtMatches) {
        consoleLogs.push(match[1].replace(/%[+v]/g, '').replace(/\\n/g, ''));
      }
      
      const messageMatch = code.match(/"message":\s*.*?"(.*?)"/);
      if (messageMatch) {
        returnValue = { message: messageMatch[1] };
      }
    }

    // Check for common errors
    if (code.includes('throw') || code.includes('raise') || code.includes('panic')) {
      const errorMatch = code.match(/(?:throw|raise|panic)\s*(?:new\s+Error\()?\s*['"](.*?)['"]/);
      if (errorMatch) {
        hasError = true;
        errorMessage = errorMatch[1];
      }
    }
  } catch (e) {
    // Analysis failed, use defaults
  }

  return { consoleLogs, returnValue, hasError, errorMessage };
}

// Simulate code execution
function simulateExecution(
  code: string, 
  runtime: Runtime, 
  testInput: any, 
  envVars: { key: string; value: string }[]
): { output: string[]; success: boolean; duration: number; result: any } {
  const output: string[] = [];
  const analysis = analyzeCode(code, runtime);
  
  // Simulate processing time
  const duration = Math.floor(Math.random() * 200) + 50;
  
  // Check for syntax-like errors
  const hasSyntaxError = 
    (runtime === 'node20' && code.includes('function') && !code.includes('{')) ||
    (runtime === 'python312' && code.includes('def') && !code.includes(':')) ||
    (runtime === 'go121' && code.includes('func') && !code.includes('{'));

  if (hasSyntaxError) {
    return {
      output: [
        `[ERROR] Syntax error in ${runtime === 'node20' ? 'JavaScript' : runtime === 'python312' ? 'Python' : 'Go'} code`,
        'Please check your code for missing brackets or syntax issues.'
      ],
      success: false,
      duration,
      result: null
    };
  }

  if (analysis.hasError) {
    return {
      output: [
        `[ERROR] ${analysis.errorMessage || 'Unknown error occurred'}`,
      ],
      success: false,
      duration,
      result: null
    };
  }

  // Process test input
  const inputName = testInput?.name || 'World';
  
  // Generate console logs with actual values
  for (const log of analysis.consoleLogs) {
    let processedLog = log;
    if (log.includes('event') || log.includes('Received')) {
      processedLog = `Received event: ${JSON.stringify(testInput)}`;
    }
    output.push(`[LOG] ${processedLog}`);
  }

  // Generate result based on code analysis
  let result: any;
  if (analysis.returnValue) {
    result = {
      statusCode: analysis.returnValue.statusCode || 200,
      body: {
        message: analysis.returnValue.message 
          ? analysis.returnValue.message.replace(/World|name/gi, inputName)
          : `Hello, ${inputName}!`,
        timestamp: new Date().toISOString(),
        input: testInput
      }
    };

    // Add env vars to result if any
    if (envVars.length > 0) {
      result.body.environment = Object.fromEntries(
        envVars.filter(e => e.key).map(e => [e.key, e.value])
      );
    }
  } else {
    result = {
      statusCode: 200,
      body: {
        message: `Hello, ${inputName}!`,
        timestamp: new Date().toISOString(),
        input: testInput
      }
    };
  }

  return {
    output,
    success: true,
    duration,
    result
  };
}

export function DeployFunction({ onNavigate }: DeployFunctionProps) {
  const [functionName, setFunctionName] = useState('my-function');
  const [runtime, setRuntime] = useState<Runtime>('node20');
  const [code, setCode] = useState(DEFAULT_CODE.node20);
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'config' | 'test'>('test');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; duration: number } | null>(null);
  const [testInput, setTestInput] = useState(`{
  "name": "EventOS",
  "userId": "user_123",
  "action": "greet"
}`);

  const handleRuntimeChange = (newRuntime: Runtime) => {
    setRuntime(newRuntime);
    setCode(DEFAULT_CODE[newRuntime]);
    setConsoleOutput([]);
    setLastResult(null);
  };

  const handleTestRun = () => {
    setIsRunning(true);
    setShowConsole(true);
    setConsoleOutput([]);

    const runtimeLabel = RUNTIME_OPTIONS.find(r => r.value === runtime)?.label;
    const timeStr = new Date().toLocaleTimeString();

    // Parse test input
    let parsedInput: any;
    try {
      parsedInput = JSON.parse(testInput);
    } catch (e) {
      setConsoleOutput([
        `[${timeStr}] ❌ Invalid JSON in test input`,
        `[${timeStr}] Please check your JSON syntax`,
      ]);
      setIsRunning(false);
      setLastResult({ success: false, duration: 0 });
      return;
    }

    // Initial output
    setConsoleOutput([
      `[${timeStr}] 🚀 Starting test execution...`,
      `[${timeStr}] Runtime: ${runtimeLabel}`,
      `[${timeStr}] Function: ${functionName}`,
      '',
    ]);

    // Simulate async execution
    setTimeout(() => {
      const result = simulateExecution(code, runtime, parsedInput, envVars);
      
      setConsoleOutput(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executing handler...`,
        '',
        ...result.output,
        '',
      ]);

      setTimeout(() => {
        if (result.success) {
          setConsoleOutput(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ✅ Execution completed in ${result.duration}ms`,
            '',
            '─── Response ───',
            JSON.stringify(result.result, null, 2),
          ]);
        } else {
          setConsoleOutput(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ❌ Execution failed`,
          ]);
        }
        setIsRunning(false);
        setLastResult({ success: result.success, duration: result.duration });
      }, 300);
    }, 500);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setShowConsole(true);
    const timeStr = () => new Date().toLocaleTimeString();

    setConsoleOutput([
      `[${timeStr()}] 📦 Starting deployment...`,
      `[${timeStr()}] Building ${functionName}...`,
    ]);

    setTimeout(() => {
      setConsoleOutput(prev => [
        ...prev,
        `[${timeStr()}] Packaging function (${(code.length / 1024).toFixed(1)} KB)...`,
        `[${timeStr()}] Uploading to EventOS...`,
      ]);
    }, 500);

    setTimeout(() => {
      setConsoleOutput(prev => [
        ...prev,
        `[${timeStr()}] Configuring runtime: ${RUNTIME_OPTIONS.find(r => r.value === runtime)?.label}`,
        envVars.length > 0 ? `[${timeStr()}] Setting ${envVars.length} environment variable(s)` : '',
      ].filter(Boolean));
    }, 1000);

    setTimeout(() => {
      setConsoleOutput(prev => [
        ...prev,
        '',
        `[${timeStr()}] ✅ Deployment successful!`,
        '',
        '─── Deployment Info ───',
        `Function: ${functionName}`,
        `URL: https://eventos.io/fn/${functionName}`,
        `Version: v${Date.now().toString().slice(-6)}`,
        '',
        '🎉 Your function is now live!',
      ]);
      setIsDeploying(false);
    }, 2000);
  };

  const currentRuntimeInfo = RUNTIME_OPTIONS.find(r => r.value === runtime)!;

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Top Bar */}
      <div 
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <Breadcrumb
            items={[
              { label: 'EventOS', onClick: () => onNavigate('dashboard') },
              { label: 'Deploy' }
            ]}
          />
          <div 
            className="h-5 w-px" 
            style={{ backgroundColor: 'var(--border)' }} 
          />
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <input
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              className="text-sm font-medium bg-transparent border-none focus:outline-none"
              style={{ color: 'var(--text-primary)', width: '150px' }}
            />
          </div>
          
          {/* Last result indicator */}
          {lastResult && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              lastResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {lastResult.success ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              {lastResult.success ? `${lastResult.duration}ms` : 'Failed'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Runtime Selector */}
          <div className="relative">
            <select
              value={runtime}
              onChange={(e) => handleRuntimeChange(e.target.value as Runtime)}
              className="appearance-none px-3 py-1.5 pr-8 rounded-lg text-sm font-medium cursor-pointer"
              style={{ 
                backgroundColor: 'var(--bg)', 
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              {RUNTIME_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" 
              style={{ color: 'var(--text-secondary)' }}
            />
          </div>

          {/* Test Run Button */}
          <button
            onClick={handleTestRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: isRunning ? '#E8F0FE' : 'var(--bg)', 
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              opacity: isRunning ? 0.7 : 1
            }}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} style={{ color: 'var(--success)' }} />
            {isRunning ? 'Running...' : 'Test Run'}
          </button>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white transition-opacity"
            style={{ 
              backgroundColor: isDeploying ? 'var(--text-secondary)' : 'var(--primary)',
              opacity: isDeploying ? 0.7 : 1
            }}
          >
            <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-bounce' : ''}`} />
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div 
          className="w-56 flex-shrink-0 flex flex-col"
          style={{ backgroundColor: '#1E1E1E', borderRight: '1px solid #333' }}
        >
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            Explorer
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-2">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-white bg-gray-700">
                <File className="w-4 h-4 text-yellow-400" />
                <span>index.{currentRuntimeInfo.extension}</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer">
                <File className="w-4 h-4 text-gray-500" />
                <span>package.json</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>node_modules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div 
            className="flex-shrink-0 flex items-center"
            style={{ backgroundColor: '#252526', borderBottom: '1px solid #333' }}
          >
            <div 
              className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer"
              style={{ 
                backgroundColor: '#1E1E1E',
                color: 'white',
                borderBottom: '2px solid var(--primary)'
              }}
            >
              <File className="w-4 h-4 text-yellow-400" />
              <span>index.{currentRuntimeInfo.extension}</span>
              <X className="w-3 h-3 text-gray-500 hover:text-white ml-2" />
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={LANGUAGE_MAP[runtime]}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Roboto Mono', monospace",
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                padding: { top: 16 },
              }}
            />
          </div>

          {/* Console Panel */}
          {showConsole && (
            <div 
              className="flex-shrink-0 h-56 flex flex-col"
              style={{ backgroundColor: '#1E1E1E', borderTop: '1px solid #333' }}
            >
              <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid #333' }}>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Terminal className="w-4 h-4" />
                  <span>Console</span>
                  {isRunning && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      Running...
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setShowConsole(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
                {consoleOutput.map((line, i) => (
                  <div 
                    key={i} 
                    className={`${
                      line.includes('✅') || line.includes('✓') ? 'text-green-400' : 
                      line.includes('❌') || line.includes('ERROR') ? 'text-red-400' : 
                      line.includes('🚀') || line.includes('🎉') ? 'text-blue-400' :
                      line.includes('📦') ? 'text-yellow-400' :
                      line.includes('[LOG]') ? 'text-cyan-400' :
                      line.includes('───') ? 'text-gray-500' :
                      line.startsWith('{') || line.startsWith('}') || line.includes('"') ? 'text-green-300' :
                      'text-gray-300'
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Configuration */}
        <div 
          className="w-80 flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ backgroundColor: 'var(--card-bg)', borderLeft: '1px solid var(--border)' }}
        >
          {/* Tabs */}
          <div 
            className="flex-shrink-0 flex"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {(['test', 'config'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                }}
              >
                {tab === 'config' ? 'Configuration' : 'Test Input'}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 space-y-5 overflow-y-auto">
            {activeTab === 'test' && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Test Event (JSON)
                  </label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="w-full h-48 px-3 py-2 rounded-lg text-xs font-mono resize-none"
                    style={{ 
                      backgroundColor: '#1E1E1E',
                      border: '1px solid var(--border)',
                      color: '#D4D4D4'
                    }}
                    placeholder='{"key": "value"}'
                  />
                </div>
                
                <button
                  onClick={handleTestRun}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{ 
                    backgroundColor: isRunning ? '#86efac' : 'var(--success)',
                    color: 'white'
                  }}
                >
                  <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Executing...' : 'Run Test'}
                </button>

                <div 
                  className="p-3 rounded-lg text-xs"
                  style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}
                >
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>💡 Tip</div>
                  <p>코드에서 <code className="px-1 py-0.5 rounded bg-gray-200">event.name</code>을 사용하면 테스트 입력의 name 값이 반영됩니다.</p>
                </div>
              </>
            )}

            {activeTab === 'config' && (
              <>
                {/* Function Info */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Function Name
                  </label>
                  <input
                    type="text"
                    value={functionName}
                    onChange={(e) => setFunctionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Environment Variables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      Environment Variables
                    </label>
                    <button
                      onClick={() => setEnvVars([...envVars, { key: '', value: '' }])}
                      className="text-xs font-medium"
                      style={{ color: 'var(--primary)' }}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add
                    </button>
                  </div>
                  
                  {envVars.length > 0 ? (
                    <div className="space-y-2">
                      {envVars.map((env, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="KEY"
                            value={env.key}
                            onChange={(e) => {
                              const newEnvVars = [...envVars];
                              newEnvVars[idx].key = e.target.value;
                              setEnvVars(newEnvVars);
                            }}
                            className="flex-1 px-2 py-1.5 rounded text-xs font-mono"
                            style={{ 
                              backgroundColor: 'var(--bg)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="value"
                            value={env.value}
                            onChange={(e) => {
                              const newEnvVars = [...envVars];
                              newEnvVars[idx].value = e.target.value;
                              setEnvVars(newEnvVars);
                            }}
                            className="flex-1 px-2 py-1.5 rounded text-xs font-mono"
                            style={{ 
                              backgroundColor: 'var(--bg)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-primary)'
                            }}
                          />
                          <button
                            onClick={() => setEnvVars(envVars.filter((_, i) => i !== idx))}
                            className="p-1.5 rounded hover:bg-red-50"
                            style={{ color: 'var(--error)' }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="text-center py-4 text-xs rounded-lg"
                      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}
                    >
                      No environment variables
                    </div>
                  )}
                </div>

                {/* Memory & Timeout */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Memory
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option>128 MB</option>
                    <option>256 MB</option>
                    <option>512 MB</option>
                    <option>1024 MB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Timeout
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option>3 seconds</option>
                    <option>10 seconds</option>
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
