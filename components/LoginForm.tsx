'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import KimbapIcon from '@/components/GimbapIcon';
import { auth } from '@/utils/supabase/supabase';
import type { LoginFormData } from '@/types';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await auth.signIn(formData.email, formData.password);

      if (authError) {
        // Supabase에서 반환된 에러 메시지를 사용자 친화적으로 변경
        if (authError.message === 'Invalid login credentials') {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (authError.message === 'Email not confirmed') {
          setError('이메일 인증이 필요합니다.');
        } else if (authError.message === 'Too many requests') {
          setError('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
        } else {
          setError(authError.message || '로그인 중 오류가 발생했습니다.');
        }
      } else if (data.user) {
        // 로그인 성공 시 홈페이지로 리다이렉트
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      // 예상치 못한 에러 처리
      console.error('Login error:', err);
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <KimbapIcon size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">코드 김밥</h1>
        <p className="text-gray-600 mt-2">블로그 스터디 모임에 오신 것을 환영합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            placeholder="your-email@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label 
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            비밀번호
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 transition-colors"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              로그인 중...
            </span>
          ) : (
            '로그인'
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          관리자가 계정을 생성해드릴 때까지 기다려주세요
        </p>
      </div>
    </div>
  );
};

export default LoginForm;