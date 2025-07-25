"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAllUsersQuery } from "@/remote/members";
import { MemberCard } from "./MemberCard";
import { usePeriodStore } from "../../../stores/usePeriodStore";

export const AttendanceMembers = () => {
  const { period } = usePeriodStore();

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useAllUsersQuery();

  if (!period?.id) {
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

  // 사용자 목록 로딩 중
  if (usersLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex items-center justify-center">
          <div className="flex items-center gap-2 text-diary-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">멤버 목록을 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (usersError) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center">
          <div className="text-red-600 text-sm mb-2">
            멤버 목록을 불러오는데 실패했습니다.
          </div>
          <div className="text-xs text-diary-muted break-all">
            {usersError.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없는 경우
  if (!users || users.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center">
          <div className="text-diary-muted text-sm mb-2">
            등록된 멤버가 없습니다.
          </div>
          <div className="text-xs text-diary-muted">
            기간: {period ? `${period.year}년 ${period.month}월` : "알 수 없음"}
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
          <div className="text-xs text-diary-muted">
            {period.start_date} ~ {period.end_date}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {users.map((user) => (
            <MemberCard key={user.id} userId={user.id} userName={user.name} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
