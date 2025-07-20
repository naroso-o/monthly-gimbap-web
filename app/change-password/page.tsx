import { Metadata } from 'next';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';

export const metadata: Metadata = {
  title: '비밀번호 변경 - 코드 김밥',
  description: '코드 김밥 블로그 스터디 모임 비밀번호 변경 페이지',
};

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <ChangePasswordForm />
      </div>
    </div>
  );
}