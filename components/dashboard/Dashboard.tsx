"use client";

import { DashboardPostCard } from "./post/DashboardPostCard";
import { PostSubmitModal } from "./post/PostSubmitModal";
import { DashboardCommentsCard } from "./comments/DashboardCommentsCard";
import { DashboardAttendanceCard } from "./attendance/DashboardAttendanceCard";
import { useAttendanceCheckQuery, useBlogPostCheckQuery, useCommentsCheckQuery } from "../../remote/checklist";

export function Dashboard({ periodId }: { periodId: string }) {
  const { data: blogPostChecklist } = useBlogPostCheckQuery(periodId);
  const { data: attendanceChecklist } = useAttendanceCheckQuery(periodId);
  const { data: commentsChecklist } = useCommentsCheckQuery(periodId);
  const completedCount = [
    blogPostChecklist?.is_completed,
    attendanceChecklist?.is_completed,
    commentsChecklist?.is_completed,
  ].filter(Boolean).length;
  
  return (
    <>
      <PostSubmitModal />
      {/* 체크리스트 요약 */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-stone-300 bg-white mb-4">
          <span className="text-2xl font-light text-stone-600">{completedCount}/3</span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          이번 달 완료한 체크리스트
        </p>
      </div>

      <DashboardPostCard periodId={periodId} />
      <DashboardAttendanceCard periodId={periodId} />
      <DashboardCommentsCard periodId={periodId} />
    </>
  );
}
