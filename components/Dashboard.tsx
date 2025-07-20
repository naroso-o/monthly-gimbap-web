"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, PenTool } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import {
  useAttendanceCheckQuery,
  useBlogPostCheckQuery,
  useCommentsCheckQuery,
  useCommentsQuery,
} from "../remote/checklist";
import { toast } from "sonner";

export function Dashboard({ periodId }: { periodId: string }) {
  const { data: blogPostChecklist } = useBlogPostCheckQuery(periodId);
  const { data: attendanceChecklist } = useAttendanceCheckQuery(periodId);
  const { data: commentsCheck } = useCommentsCheckQuery(periodId);
  const { data: comments } = useCommentsQuery(commentsCheck?.id || "");

  const completedCount = [
    blogPostChecklist?.is_completed,
    attendanceChecklist?.is_completed,
  ].filter(Boolean).length;

  const handleUnimplementedFunction = () => {
    toast.info("아직 구현되지 않은 기능입니다.");
  };

  return (
    <>
      {/* 체크리스트 요약 */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-stone-300 bg-white mb-4">
          <span className="text-2xl font-light text-stone-600">
            {completedCount}/3
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          이번 달 완료한 체크리스트
        </p>
      </div>

      {/* 체크리스트 카드들 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 블로그 글 작성 */}
        <DashboardCard
          title="블로그 글쓰기"
          icon={<PenTool className="w-5 h-5 text-stone-600" />}
          description="이번 달 블로그 글 1개 작성하기"
          isCompleted={blogPostChecklist?.is_completed || false}
          button={
            <Button
              variant="primary"
              size="sm"
              className="w-full text-sm"
              onClick={handleUnimplementedFunction}
            >
              {blogPostChecklist?.is_completed ? "완료!" : "글 작성 체크"}
            </Button>
          }
        />

        <DashboardCard
          title="수요일 출석"
          icon={<Calendar className="w-5 h-5 text-stone-600" />}
          description={`월 2회 이상 수요일 출석 (${
            attendanceChecklist?.wednesday_count || 0
          }/2)`}
          isCompleted={attendanceChecklist?.is_completed || false}
          button={
            <Button
              variant="primary"
              size="sm"
              className="w-full text-sm"
              onClick={handleUnimplementedFunction}
            >
              {attendanceChecklist?.is_completed ? "완료!" : "출석 기록하기"}
            </Button>
          }
        />

        <DashboardCard
          title="댓글 활동"
          icon={<MessageCircle className="w-5 h-5 text-stone-600" />}
          description={`월 4명 이상에게 댓글 달기 (${comments?.length || 0}/4)`}
          isCompleted={commentsCheck?.is_completed || false}
          button={
            <Button
              variant="primary"
              size="sm"
              className="w-full text-sm"
              onClick={handleUnimplementedFunction}
            >
              {commentsCheck?.is_completed ? "완료!" : "댓글 작성하기"}
            </Button>
          }
        />
      </div>
    </>
  );
}
