# EventOS Lite - Design System Guidelines

## 🎨 1. 컬러 시스템 (Minimal Console Palette)

FaaS 콘솔은 방해 요소 없는 흰색/회색 기반 + 파란색 강조가 핵심입니다.

### Primary Colors
| Token | Value | 설명 |
|-------|-------|------|
| `--primary` | #2D6FF3 | 메인 액션 색 (Replay, Deploy 등) |
| `--primary-light` | #E8F0FE | hover / subtle background |
| `--primary-dark` | #1F56C3 | active / border emphasis |

### Neutral Colors
| Token | Value | 설명 |
|-------|-------|------|
| `--bg` | #F6F8FB | 전체 배경 |
| `--card-bg` | #FFFFFF | 카드, 패널, 테이블 배경 |
| `--border` | #E5E8EC | Card/Divider border |
| `--text-primary` | #1A1F27 | 주요 텍스트 |
| `--text-secondary` | #6B7684 | 부 텍스트/라벨 |

### Semantic Colors
| Token | Value | 설명 |
|-------|-------|------|
| `--success` | #2F9B4D | 성공 표시 (●) |
| `--error` | #E03538 | 실패 표시 (✗) |
| `--warning` | #FFB020 | 경고(alert) |
| `--info` | #2D6FF3 | 정보 표시 |

---

## 📏 2. 타이포그래피 스케일 (Minimal Console Typography)

Pretendard + SemiBold/Regular 기준
(개발자 콘솔 느낌 + Toss의 명료한 폰트톤)

| 스타일 | 크기 | 두께 | 용도 |
|-------|------|------|------|
| h1 | 20px | 600 | 페이지 타이틀 |
| h2 | 18px | 600 | 카드/섹션 타이틀 |
| h3 | 16px | 600 | 소제목, 테이블 헤더 |
| body | 14px | 400 | 기본 본문 |
| caption | 12px | 400 | 보조 설명, 라벨 |
| code | 13px | 400 | JSON/로그용 monospace |

### 특징
- 숫자 정보(실행 시간/실행 ID)는 **SemiBold**
- 시간/날짜는 14px/400로 여백 적게

---

## 🔲 3. 간격 시스템 (Spacing Scale)

콘솔 스타일은 리듬이 일정한 spacing이 핵심입니다.

| Token | px | 사용 위치 |
|-------|-------|----------|
| `--space-4` | 4px | dot/아이콘 간격 |
| `--space-8` | 8px | 라벨/행 내부 여백 |
| `--space-12` | 12px | 카드 요소 간 간격 |
| `--space-16` | 16px | 카드 padding |
| `--space-20` | 20px | 상단 섹션 패딩 |
| `--space-24` | 24px | 페이지 섹션 간격 |
| `--space-32` | 32px | 대 타이틀 상하 여백 |

### 기준
- 모든 카드 내부 padding = **20~24px**
- 테이블 로우 높이 = **44px**
- Timeline/Storyboard는 **16~20px 간격** grid

---

## 🎭 4. 컴포넌트 패턴 (FaaS Console Minimal Components)

EventOS Lite를 구성하는 최소 핵심 컴포넌트들.

### 4-1. Card
- background: **white**
- border: **1px solid var(--border)**
- radius: **16px** (rounded-2xl)
- 내부 padding: **20px**
- **shadow 없음** (콘솔 스타일 유지)

### 4-2. Button

#### Primary
- 배경: `var(--primary)`
- 텍스트: white
- radius: **9999px** (pill)
- hover: opacity 0.9
- disabled: opacity 0.5

#### Ghost
- 배경: white
- border: 1px solid var(--border)
- 텍스트: var(--text-secondary)
- radius: **12px**

### 4-3. Badge (Status Chip)
- radius: **8px**
- **SUCCESS**: 연한 초록 배경 + 초록 텍스트
- **FAILED**: 연한 빨강 배경 + 빨강 텍스트
- **REPLAY**: 연파랑 배경 + 파랑 텍스트
- **SHADOW**: 연파랑 배경 + 짙은 파랑 텍스트

### 4-4. Table
- row height: **44px**
- zebra-stripe **없음**
- border minimal
- hover 시 오른쪽에 **→ icon** 표시

### 4-5. JSON Viewer / Log Viewer
- monospace (e.g. "Roboto Mono")
- background: **#F8FAFD**
- border: 1px solid var(--border)
- padding: **12px**
- radius: **12px**

### 4-6. Timeline Dot
- **SUCCESS**: green dot (#2F9B4D)
- **FAILED**: red dot (#E03538)
- **SHADOW**: outline + blue
- **REPLAY**: double-layer dot (outer light-blue, inner blue)

### 4-7. Compare Layout
- **2 columns grid**
- gutter: **24px**
- left = Original
- right = Replay/Shadow
- highlight diff with **light yellow background**

---

## ♿ 5. 접근성 가이드 (Minimal)

기본 원칙 3개만 따라도 충분합니다.

### 1) 대비(contrast ratio)
- Blue Primary(#2D6FF3) + white 는 **WCAG AA 준수**
- Red/Green 배지 대비는 **최소 4.5:1** 유지

### 2) Focus style
- 모든 버튼/링크/점(dot)은
  - **outline: 2px solid #AECBFA**
  - radius 유지

### 3) 키보드 Navigable
- Timeline의 도트(dot)도 키보드로 접근 가능해야 함
- **← → ↑ ↓** 로 이동 → **Enter** 시 Execution Detail

---

## 🌗 6. 다크모드 전략 (Minimal)

시간 부족을 고려한 역전 패턴 1개만 정의.

### 방법: "Color Token Swap" 방식

밝은 모드 기준 token을 아래처럼 교체:

| Light | Dark |
|-------|------|
| `--bg: #F6F8FB` | `#111418` |
| `--card-bg: #FFFFFF` | `#1A1F27` |
| `--text-primary: #1A1F27` | `#F6F8FB` |
| `--text-secondary: #6B7684` | `#A5ACB8` |
| `--border: #E5E8EC` | `#2A3038` |
| `--primary: #2D6FF3` | 동일 (primary는 브랜드 컬러라 유지) |

Shadow, 버튼 radius, spacing은 **그대로 유지**.

---

## 📱 7. 반응형 브레이크포인트 (Minimal Console Layout)

AWS·Cloudflare Workers·Vercel Dashboard 기준의 브레이크포인트.

| 이름 | px 기준 | 용도 |
|------|---------|------|
| mobile | < 640px | 세로 스크롤 기반, 카드 full width |
| tablet | 640–1024px | 2열 구성, Timeline 컴팩트 |
| desktop | 1024–1440px | 기본 FaaS 콘솔 레이아웃 |
| wide | >1440px | Timeline/Compare 화면에서 여백 확장 |

### 핵심 규칙

#### Function List / Storyboard / Table
- mobile: **1열**
- tablet: **2열**
- desktop: **2~3열**

#### Execution Detail
- mobile: **상→하**
- desktop: **좌(데이터)/우(액션) 2열**

---

## 🎯 구현 체크리스트

- ✅ CSS Variables를 통한 일관된 컬러 관리
- ✅ 16px 기준 rounded-2xl 카드
- ✅ 44px 테이블 로우 높이
- ✅ Pill 버튼 (rounded-full)
- ✅ Ghost 버튼 (border + rounded-lg)
- ✅ 페이지 padding: 24px (p-6)
- ✅ 섹션 간격: 24px (space-y-6)
- ✅ 카드 내부: 20-24px padding
- ✅ Timeline 도트: 8px (w-2 h-2)
- ✅ JSON Viewer: monospace + #F8FAFD 배경

---

이 가이드라인은 **AWS, GCP, Azure**의 장점을 결합한 현대적이고 미니멀한 클라우드 콘솔 디자인을 구현합니다.
