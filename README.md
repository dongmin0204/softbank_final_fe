# EventOS Lite - Frontend

EventOS Lite는 서버리스 함수 실행을 위한 디버깅 친화적 플랫폼입니다.

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Code Editor**: Monaco Editor
- **Charts**: Recharts

## 📦 Installation

```bash
npm install
```

## 🔧 Development

```bash
npm run dev
```

Development server: http://localhost:3000

## 🏗️ Build

```bash
npm run build
```

## 🌐 Vercel Deployment

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect Vite and configure the build

### Environment Variables (if needed)

```
VITE_API_URL=https://your-api-url.com
```

## 📁 Project Structure

```
src/
├── components/
│   ├── aws/          # Main page components
│   │   ├── Dashboard.tsx
│   │   ├── DeployFunction.tsx
│   │   ├── ExecutionTimeline.tsx
│   │   ├── ExecutionDetail.tsx
│   │   ├── CompareView.tsx
│   │   ├── FailureStoryboard.tsx
│   │   └── FunctionsList.tsx
│   ├── ui/           # Reusable UI components
│   ├── Header.tsx
│   └── Sidebar.tsx
├── data/
│   └── mockData.ts   # Mock data for development
├── styles/
│   └── globals.css
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Features

- **Dashboard**: 실행 통계, Replay/Shadow 비율
- **Deploy**: Monaco Editor 기반 온라인 IDE
- **Timeline**: 실시간 실행 타임라인 (5분~24시간)
- **Execution Detail**: 상세 실행 정보 + Replay/Shadow
- **Failure Storyboard**: 실패 실행 분석

## 📄 License

MIT
