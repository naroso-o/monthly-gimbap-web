import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: '로그인 - 코드 김밥',
  description: '코드 김밥 블로그 스터디 모임 로그인 페이지',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}