"use client";

import { Loader2 } from "lucide-react";
import { useMemberDashboardQuery } from "@/remote/members";

interface MemberCardProps {
  userId: string;
  userName: string;
  periodId: string;
}

export const MemberCard = ({ userId, userName, periodId }: MemberCardProps) => {
  const {
    data: member,
    isLoading,
    error,
  } = useMemberDashboardQuery(userId, periodId);

  if (isLoading) {
    return (
      <div className="p-3 bg-diary-card border border-diary-border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-diary-text">
            {userName}
          </span>
          <Loader2 className="w-3 h-3 animate-spin text-diary-muted" />
        </div>
        <div className="h-1.5 bg-diary-border rounded-full animate-pulse mb-2"></div>
        <div className="text-xs text-diary-muted">로딩 중...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-3 bg-diary-card border border-diary-border rounded-lg opacity-50">
        <span className="text-sm text-diary-muted">{userName} - 로딩 실패</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-diary-card border border-diary-border rounded-lg hover:bg-diary-border/10 transition-colors">
      {/* 상단: 이름과 완료율 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-diary-text">
            {member.user_name}
          </span>
          {member.is_online && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <span className={`text-center px-2 py-1 rounded font-medium ${
            member.blog_completed 
              ? "bg-amber-500 text-white" 
              : "text-diary-muted"
          }`}>
            블로그
          </span>
          <span className={`text-center px-2 py-1 rounded font-medium ${
            member.comments_made >= 4 
              ? "bg-orange-500 text-white" 
              : member.comments_made >= 2
              ? "bg-orange-300 text-orange-900"
              : member.comments_made >= 1
              ? "bg-orange-200 text-orange-800"
              : "text-diary-muted"
          }`}>
            댓글
          </span>
          <span className={`text-center px-2 py-1 rounded font-medium ${
            member.attendance_days >= 4 
              ? "bg-stone-600 text-white" 
              : member.attendance_days >= 2
              ? "bg-stone-400 text-stone-800"
              : member.attendance_days >= 1
              ? "bg-stone-300 text-stone-700"
              : "text-diary-muted"
          }`}>
            수요일
          </span>
        </div>
      </div>
    </div>
  );
};
