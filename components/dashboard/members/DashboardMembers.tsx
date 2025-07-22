"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  useMemberDashboardSummaryQuery,
  useTeamSummaryStatsQuery,
} from "@/remote/members";
import { useCurrentPeriodQuery } from "@/remote/period";
import { MemberCard } from "./MemberCard";

interface DashboardMembersProps {
  periodId?: string; // optional로 변경
}

export const DashboardMembers = ({ periodId }: DashboardMembersProps) => {
  // 현재 기간 자동 조회
  const { data: currentPeriod, isLoading: periodLoading } =
    useCurrentPeriodQuery();

  // periodId가 전달되면 그것을 사용, 아니면 현재 기간 사용
  const activePeriodId = periodId || currentPeriod?.id;

  const {
    data: members,
    isLoading: membersLoading,
    error: membersError,
  } = useMemberDashboardSummaryQuery(activePeriodId || "");
  const { data: teamStats, isLoading: statsLoading } = useTeamSummaryStatsQuery(
    activePeriodId || ""
  );

  // 기간 로딩 중
  if (periodLoading && !periodId) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex items-center justify-center">
          <div className="flex items-center gap-2 text-diary-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">현재 기간을 찾는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 현재 기간이 없는 경우
  if (!activePeriodId) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center">
          <div className="text-diary-muted text-sm mb-2">
            현재 기간이 설정되지 않았습니다.
          </div>
          <div className="text-xs text-diary-muted text-center">
            {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 기간을{" "}
            <br />
            데이터베이스에 추가해주세요.
          </div>
        </CardContent>
      </Card>
    );
  }

  // 멤버 데이터 로딩 중
  if (membersLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex items-center justify-center">
          <div className="flex items-center gap-2 text-diary-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">멤버 현황을 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (membersError) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center">
          <div className="text-red-600 text-sm mb-2">
            멤버 현황을 불러오는데 실패했습니다.
          </div>
          <div className="text-xs text-diary-muted">
            Period ID: {activePeriodId}
          </div>
          <div className="text-xs text-diary-muted break-all">
            {membersError.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없는 경우
  if (!members || members.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center">
          <div className="text-diary-muted text-sm mb-2">
            등록된 멤버가 없습니다.
          </div>
          <div className="text-xs text-diary-muted">
            기간:{" "}
            {currentPeriod
              ? `${currentPeriod.year}년 ${currentPeriod.month}월`
              : "알 수 없음"}
          </div>
          <div className="text-xs text-diary-muted">
            Period ID: {activePeriodId}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-diary-text text-sm">멤버 현황</h3>
          <Badge variant="outline" className="text-xs">
            {members.length}명
          </Badge>
        </div>

        {/* 현재 기간 표시 */}
        {currentPeriod && (
          <div className="mb-3 text-xs text-diary-muted text-center">
            {currentPeriod.year}년 {currentPeriod.month}월
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {members.map((member) => (
            <MemberCard key={member.user_id} member={member} />
          ))}
        </div>

        {/* 하단 요약 */}
        <div className="mt-4 pt-3 border-t border-diary-border">
          <div className="flex justify-between text-xs">
            <span className="text-diary-muted">완료율 평균</span>
            <span className="text-diary-text font-medium">
              {statsLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                `${teamStats?.avg_completion_rate || 0}%`
              )}
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-diary-muted">온라인 멤버</span>
            <span className="text-diary-text font-medium">
              {members.filter((member) => member.is_online).length}명
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};