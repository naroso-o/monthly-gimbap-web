'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MessageSquare, FileText, Settings, LogOut, BarChart3 } from 'lucide-react';
import KimbapIcon from '@/components/GimbapIcon';
import { auth } from '@/utils/supabase/supabase';
import type { User, MonthlyPeriod, TabItem } from '@/types';

interface HomeLayoutProps {
  user: User | null;
  currentPeriod: MonthlyPeriod | null;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ user, currentPeriod }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('blog');
  const [loading, setLoading] = useState<boolean>(false);

  const tabs: TabItem[] = [
    { id: 'blog', label: '블로그 글', icon: FileText },
    { id: 'attendance', label: '출석', icon: Clock },
    { id: 'comments', label: '댓글', icon: MessageSquare },
    { id: 'stats', label: '통계', icon: BarChart3 }
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blog':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 달 블로그 글 작성</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">월 1회 블로그 글 작성</span>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-5 h-5 text-orange-600 rounded" />
                    <span className="ml-2 text-sm text-gray-600">완료</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Issue URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-repo/issues/123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">출석 체크</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">월 2회 이상 수요일 출석 (11PM-12AM)</span>
                  <span className="text-orange-600 font-medium">1/2</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">오늘 출석하기</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        시작 시간
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        종료 시간
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모 (선택)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="오늘 한 일이나 메모를 적어주세요"
                    ></textarea>
                  </div>
                  <button className="w-full mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                    출석 기록하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">댓글 체크</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">월 4명 이상에게 댓글 달기</span>
                  <span className="text-orange-600 font-medium">2/4</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">멤버별 댓글 체크</h4>
                  <div className="space-y-2">
                    {['김철수', '이영희', '박민수', '최지은', '정한솔'].map((name, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-gray-700">{name}</span>
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-orange-600 rounded" />
                          <span className="ml-2 text-sm text-gray-600">댓글 완료</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 달 통계</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12시간</div>
                  <div className="text-sm text-blue-600">총 활동 시간</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8일</div>
                  <div className="text-sm text-green-600">총 출석일</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3회</div>
                  <div className="text-sm text-purple-600">수요일 출석</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">5명</div>
                  <div className="text-sm text-orange-600">댓글 대상</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">요일별 활동</h4>
              <div className="space-y-2">
                {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{day}요일</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{Math.floor(Math.random() * 5)}시간</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">시간대별 활동</h4>
              <div className="space-y-2">
                {[
                  { time: '09:00-12:00', label: '오전', hours: 2 },
                  { time: '12:00-18:00', label: '오후', hours: 4 },
                  { time: '18:00-23:00', label: '저녁', hours: 3 },
                  { time: '23:00-01:00', label: '야간', hours: 3 }
                ].map((slot, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-600">{slot.label}</span>
                      <span className="text-xs text-gray-400">{slot.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${(slot.hours / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{slot.hours}시간</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                <KimbapIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">코드 김밥</h1>
                <p className="text-sm text-gray-500">
                  안녕하세요, {user?.name}님!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {currentPeriod && (
                  <span>
                    {currentPeriod.year}년 {currentPeriod.month}월
                  </span>
                )}
              </div>
              <button
                onClick={handleChangePassword}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default HomeLayout;