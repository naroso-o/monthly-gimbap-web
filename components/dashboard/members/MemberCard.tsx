"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useUserInfoQuery } from "@/remote/users";
import { MemberDashboardSummary } from "@/remote/members";
import { 
  getCompletionColor, 
  formatLastActivity, 
  getMemberStatusText 
} from "@/utils/members";

interface MemberCardProps {
  member: MemberDashboardSummary;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  // 실제 사용자 정보 조회
  const { data: userInfo, isLoading: userLoading } = useUserInfoQuery(member.user_id);

  // 사용자 정보가 로딩 중이면 기본값 사용
  const displayName = userLoading 
    ? "로딩중..." 
    : userInfo?.name || member.user_name || "알 수 없음";
    
  const avatarInitial = userLoading 
    ? "?" 
    : (userInfo?.name || member.user_name)?.charAt(0) || "?";

  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg hover:bg-diary-border/20"
      title={getMemberStatusText(member)}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* 온라인 상태 표시 */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-diary-border flex items-center justify-center">
            <span className="text-xs font-medium text-diary-text">
              {avatarInitial}
            </span>
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-diary-card ${
              member.is_online ? "bg-green-500" : "bg-diary-muted"
            }`}
            title={
              member.is_online
                ? "온라인"
                : `${formatLastActivity(member.last_activity)} 활동`
            }
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-diary-text truncate">
              {displayName}
            </span>
            {member.completed_tasks === member.total_tasks ? (
              <CheckCircle2 className="w-3 h-3 text-diary-accent flex-shrink-0" />
            ) : (
              <Circle className="w-3 h-3 text-diary-muted flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-diary-border rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${member.completion_rate}%`,
                  backgroundColor: getCompletionColor(member.completion_rate),
                }}
              />
            </div>
            <span className="text-xs text-diary-muted flex-shrink-0">
              {member.completed_tasks}/{member.total_tasks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};