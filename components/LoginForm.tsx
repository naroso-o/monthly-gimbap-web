"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GimbapIcon } from "@/components/GimbapIcon";
import { Mail, Lock } from "lucide-react";
import type { LoginFormData } from "@/types";
import { createClient } from "@/utils/supabase/client";

const LoginForm: React.FC = () => {
  const supabase = createClient();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        // Supabase에서 반환된 에러 메시지를 사용자 친화적으로 변경
        if (authError.message === "Invalid login credentials") {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else if (authError.message === "Email not confirmed") {
          setError("이메일 인증이 필요합니다.");
        } else if (authError.message === "Too many requests") {
          setError(
            "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요."
          );
        } else {
          setError(authError.message || "로그인 중 오류가 발생했습니다.");
        }
      } else if (data.user) {
        // 쿠키가 설정될 시간을 주기 위해 약간의 지연
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (err) {
      // 예상치 못한 에러 처리
      console.error("Login error:", err);
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="비밀번호"
                    value={formData.password}
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
                variant="primary"
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
                    로그인 중...
                  </span>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-stone-500">함께 성장하는 김밥 스터디 🍙</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
