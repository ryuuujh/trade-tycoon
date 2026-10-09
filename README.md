# 🚢 무역왕 키우기

Vercel에 배포할 수 있는 정적 웹게임의 시작 템플릿입니다.

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

Vercel에서 Framework Preset을 **Vite**, Build Command를 `npm run build`, Output Directory를 `dist`로 설정합니다.

## 파일 역할
- `index.html`: 게임 레이아웃 + 항구 씬(인라인 SVG)
- `css/style.css`: 디자인·애니메이션
- `js/game.js`: 게임 상태와 진행
- `js/data.js`: 미션(퀴즈)·결과 대사·돌발 이벤트 데이터
- `js/characters.js`: 사장님 캐릭터 4명 데이터, 능력치, 대사, 16×20 픽셀 스프라이트
- `js/buyers.js`: 나라별 바이어 8명 데이터, 성격 태그, 반응 대사, 16×16 픽셀 초상화
- `js/audio.js`: Web Audio API 로 합성한 칩튠 배경음악 시퀀서와 효과음, 음소거/음량 설정 저장
- `js/ui.js`: 화면 렌더링 (HUD, 대화창, 결과 팝업, 연출)
- `vite.config.js`: 빌드 설정 (`base: './'` 로 상대 경로 산출물 생성)
- `assets/images/`: 이미지 리소스
- `assets/sounds/`: 효과음

현재는 그래픽과 게임 기능을 확장하기 전의 기본 골격입니다.
