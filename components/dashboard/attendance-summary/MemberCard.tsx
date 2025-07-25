"use client";

import { useMemberOnlineStatusQuery } from "@/remote/members";

interface MemberCardProps {
  userId: string;
  userName: string;
}

export const MemberCard = ({ userId, userName }: MemberCardProps) => {
  const { data: onlineStatus } = useMemberOnlineStatusQuery(userId);

  return (
    <div className="p-3 bg-diary-card border border-diary-border rounded-lg hover:bg-diary-border/10 transition-colors">
      {/* 상단: 이름과 완료율 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-diary-text">
            {userName}
          </span>
          {onlineStatus?.is_online && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};
