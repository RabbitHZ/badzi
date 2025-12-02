<p align="center">
  <img src="public/logo.svg" width="80" height="80" alt="Badzi Logo" />
</p>

<h1 align="center">Badzi</h1>

<p align="center">
  Decorate your GitHub Profile — Craft a badge that's uniquely you.
</p>

<p align="center">
  실시간 미리보기를 제공하는 페이지 조회수 트래킹 뱃지 생성기입니다.
</p>

## 기능

- **실시간 미리보기** - 커스터마이징하는 즉시 뱃지 변화를 확인
- **커스텀 라벨** - 뱃지에 원하는 텍스트 추가
- **색상 팔레트** - Pastel/Vivid 탭에서 40가지 색상 선택
- **스타일 타입** - Default, Maple, Rabbit 스타일 선택
- **다양한 내보내기 형식** - URL, Markdown, HTML로 복사
- **글래스모피즘 UI** - 블러 효과가 적용된 모던한 디자인

## 기술 스택

- **프레임워크**: Next.js 15
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI
- **아이콘**: Lucide React

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 pnpm

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/badzi.git

# 프로젝트 폴더로 이동
cd badzi

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

## 사용 방법

1. 트래킹할 URL 입력
2. 라벨 커스터마이징 (기본값: "Views")
3. 스타일 타입 선택 (Default, Maple, Rabbit)
4. Default 스타일인 경우 색상 선택
5. 생성된 코드 복사 (URL, Markdown, HTML 중 선택)
6. README, 블로그, 웹사이트에 붙여넣기

## 프로젝트 구조

```
badzi/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── glassmorphic-nav.tsx    # 메인 뱃지 생성기 컴포넌트
│   └── ui/                      # 재사용 가능한 UI 컴포넌트
├── public/
│   └── images/
├── lib/
│   └── utils.ts
└── package.json
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |

## API

이 프론트엔드는 Badzi 백엔드 서버와 연동됩니다:

```
https://badzi-server-464152216340.asia-northeast3.run.app
```

### 엔드포인트

| 엔드포인트 | 설명 |
|------------|------|
| `/api/badges` | 조회수가 포함된 뱃지 생성 |
| `/api/badges/preview` | 미리보기 뱃지 생성 |

### 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `url` | string | 트래킹할 URL |
| `label` | string | 뱃지 라벨 텍스트 |
| `color` | string | Hex 색상 코드 (# 제외) |
| `styleType` | string | 스타일 타입 (default, maple, rabbit) |
