import { defineConfig } from 'vite';

// base: './' → 빌드 산출물이 상대 경로를 쓰므로 Vercel 루트 배포, 하위 경로 배포,
// dist/index.html 을 직접 여는 경우 모두 CSS/JS 가 정상 로드됩니다.
export default defineConfig({
  base: './'
});
