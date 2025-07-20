// app/login/page.tsx (서버 컴포넌트)
import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: '로그인 - 코드 김밥',
  description: '코드 김밥 블로그 스터디 로그인 페이지',
};

export default function LoginPage() {
  return <LoginForm />;
}