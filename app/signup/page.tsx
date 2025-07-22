// app/signup/page.tsx
import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 - 코드 김밥',
  description: '코드 김밥 블로그 스터디 회원가입 페이지',
};

export default function SignupPage() {
  return <SignupForm />;
}