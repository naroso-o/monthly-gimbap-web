"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GimbapIcon } from "@/components/icon/GimbapIcon";
import { Mail, Lock, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const SignupForm = () => {
  const supabase = createClient();
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // 1. Supabase Auth로 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message === "User already registered") {
          setError("이미 가입된 이메일 주소입니다.");
        } else if (authError.message.includes("Password")) {
          setError("비밀번호가 너무 약합니다. 더 복잡한 비밀번호를 사용해주세요.");
        } else {
          setError(authError.message || "회원가입 중 오류가 발생했습니다.");
        }
        return;
      }

      // 2. public.users 테이블에 사용자 정보 추가
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            is_admin: false,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          setError("사용자 프로필 생성 중 오류가 발생했습니다.");
          return;
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#F7F5F3" }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <GimbapIcon className="w-16 h-16 mx-auto mb-4" />
            <h1
              className="text-2xl font-medium text-stone-700 mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              코드 김밥
            </h1>
            <p className="text-sm text-stone-500">블로그 스터디 모임</p>
          </div>

          <Card className="bg-white border border-stone-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-stone-700">회원가입 완료!</h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  이메일로 인증 링크를 보내드렸습니다.<br />
                  인증을 완료한 후 로그인해주세요.
                </p>
                <Link href="/login">
                  <Button className="w-full mt-4">
                    로그인 페이지로 이동
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-xs text-stone-500">함께 성장하는 김밥 스터디 🍙</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F7F5F3" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <GimbapIcon className="w-16 h-16 mx-auto mb-4" />
          <h1
            className="text-2xl font-medium text-stone-700 mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            코드 김밥
          </h1>
          <p className="text-sm text-stone-500">블로그 스터디 모임</p>
        </div>

        <Card className="bg-white border border-stone-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-stone-700 mb-1">회원가입</h2>
              <p className="text-sm text-stone-500">김밥 스터디에 참여하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 border-stone-200 focus:border-stone-400 bg-white text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 border-stone-200 focus:border-stone-400 bg-white text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="비밀번호 (최소 6자)"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 border-stone-200 focus:border-stone-400 bg-white text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 border-stone-200 focus:border-stone-400 bg-white text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    가입 중...
                  </span>
                ) : (
                  "회원가입"
                )}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-stone-500">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-stone-700 hover:underline font-medium">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-stone-500">함께 성장하는 김밥 스터디 🍙</p>
        </div>
      </div>
    </div>
  );
};