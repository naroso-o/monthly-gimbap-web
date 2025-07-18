# 🍙 코드 김밥 (Code Kimbap)

블로그 스터디 모임을 위한 체크리스트 관리 웹 애플리케이션

## 📋 프로젝트 개요

코드 김밥 블로그 스터디 모임 멤버들의 월별 활동을 관리하고 추적하는 시스템입니다.

매달 3가지 체크리스트를 완수하지 못하면 벌금을 내는 시스템으로 운영됩니다.

## ✨ 주요 기능

### 🔐 인증 시스템

- 관리자가 멤버 계정 생성
- 멤버는 최초 로그인 후 비밀번호 변경 가능
- 세션 기반 인증 (Supabase Auth)

### 📝 월별 체크리스트 (3가지)

#### 1. 블로그 글 작성

- 월 1회 블로그 글 작성
- GitHub Issue로 관리
- 본인이 완료 체크

#### 2. 수요일 출석

- 월 2회 이상 수요일 11PM-12AM 출석
- 출석 시간 기록 (시작/종료 시간 선택)
- 평소 출석도 기록 가능

#### 3. 댓글 활동

- 이전 달 포스팅 중 월 4명 이상에게 댓글 달기
- (상호 확인을 할지, 댓글 단 포스트의 링크를 첨부할지 미정)

### 📊 통계 기능 (예정)

- 사용자별 월별 활동 시간
- 요일별 출석 패턴
- 시간대별 활동 분석
- 체크리스트 완료 현황

## 🛠 기술 스택

### Frontend

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (아이콘)

### Backend

- **Supabase** (Database + Authentication)
- **PostgreSQL** (관계형 데이터베이스)
- **Row Level Security (RLS)**

### 배포

- **Vercel** (Frontend)
- **Supabase** (Backend)

## 🏗 프로젝트 구조

```
code-kimbap/
├── app/                    # Next.js App Router
│   ├── login/             # 로그인 페이지
│   ├── change-password/   # 비밀번호 변경
│   ├── page.tsx          # 홈페이지 (서버 컴포넌트)
│   └── layout.tsx        # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── GimbapIcon.tsx    # 김밥 아이콘
│   ├── LoginForm.tsx     # 로그인 폼
│   ├── ChangePasswordForm.tsx
│   └── HomeLayout.tsx    # 홈 레이아웃
├── types/                # TypeScript 타입 정의
├── utils/                # 유틸리티 함수
│   └── supabase.ts      # Supabase 클라이언트
├── middleware.ts         # 인증 미들웨어
└── README.md
```

## 🗄 데이터베이스 스키마

### 주요 테이블

- `users` - 사용자 정보
- `monthly_periods` - 월별 기간 관리
- `attendance_records` - 출석 기록
- `checklist_blog_posts` - 블로그 글 체크리스트
- `checklist_attendance` - 출석 체크리스트
- `checklist_comments` - 댓글 체크리스트
- `comment_checks` - 댓글 상호 체크
- `penalties` - 벌금 관리

### 통계 뷰

- `user_monthly_stats` - 월별 통계
- `user_weekday_stats` - 요일별 통계
- `monthly_checklist_status` - 체크리스트 현황

## 🔧 주요 기능 설명

### 인증 플로우

1. 관리자가 계정 발급
2. 사용자 계정 확인 후 비밀번호 설정

### 체크리스트 관리

1. 매월 자동으로 체크리스트 생성
2. 사용자별 진행상황 추적
3. 자동 완료 여부 계산
4. 벌금 계산 시스템

## 📈 향후 계획

- [ ] 모바일 앱 개발
- [ ] 실시간 알림 시스템
- [ ] 데이터 내보내기 기능
- [ ] 관리자 대시보드 개선
- [ ] 벌금 결제 시스템 연동

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
