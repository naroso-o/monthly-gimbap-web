"use client";

import { PostCard } from "./PostCard";
import { CommentsCard } from "./CommentCard";
import { AttendanceCard } from "./AttendanceCard";
import { AttendanceModal } from "./AttendanceModal";
import { useAttendanceCheckQuery } from "@/remote/attendance";
import { CommentModal } from "./CommentModal";
import { useUserCommentStatusQuery } from "@/remote/comments";
import { useBlogPostCheckQuery } from "@/remote/blog";
import { usePeriodStore } from "@/stores/usePeriodStore";
import { PostModal } from "./PostModal";

export function ChecklistSummaryContainer() {
  const { period } = usePeriodStore();

  const { data: attendanceChecklist, isLoading: attendanceChecklistLoading } =
    useAttendanceCheckQuery(period?.id || "");
  const { data: userCommentStatus, isLoading: userCommentStatusLoading } =
    useUserCommentStatusQuery(period?.id || "");
  const { data: blogPostCheck, isLoading: blogPostCheckLoading } =
    useBlogPostCheckQuery(period?.id || "");

  const completedCount = [
    blogPostCheck?.is_completed,
    attendanceChecklist?.is_completed,
    userCommentStatus?.is_completed,
  ].filter(Boolean).length;

  if (
    !attendanceChecklist ||
    !userCommentStatus ||
    !blogPostCheck ||
    attendanceChecklistLoading ||
    userCommentStatusLoading ||
    blogPostCheckLoading
  ) {
    return <div>Loading...</div>;
    // return <ChecklistSummarySkeleton />;
  }

  return (
    <>
      <PostModal />
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
        <PostCard />
        <AttendanceCard />
        <CommentsCard />
      </div>
    </>
  );
}
