"use client";

import { DashboardPostCard } from "./post/DashboardPostCard";
import { PostSubmitModal } from "./post/PostSubmitModal";
import { DashboardCommentsCard } from "./comments/DashboardCommentsCard";
import { DashboardAttendanceCard } from "./attendance/DashboardAttendanceCard";
import { AttendanceModal } from "./attendance/AttendanceModal";
import { useAttendanceCheckQuery } from "@/remote/attendance";
import { CommentModal } from "./comments/CommentModal";
import { useUserCommentStatusQuery } from "@/remote/comments";
import { useBlogPostCheckQuery } from "@/remote/blog";

export function Dashboard({ periodId }: { periodId: string }) {
  const { data: attendanceChecklist } = useAttendanceCheckQuery(periodId);
  const { data: userCommentStatus } = useUserCommentStatusQuery(periodId);
  const { data: blogPostCheck } = useBlogPostCheckQuery(periodId);
  
  const completedCount = [
    blogPostCheck?.is_completed,
    attendanceChecklist?.is_completed,
    userCommentStatus?.is_completed,
  ].filter(Boolean).length;

  return (
    <>
      <PostSubmitModal />
      <AttendanceModal />
      <CommentModal />
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardPostCard periodId={periodId} />
        <DashboardAttendanceCard periodId={periodId} />
        <DashboardCommentsCard periodId={periodId} />
      </div>
    </>
  );
}