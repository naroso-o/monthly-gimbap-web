import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";
import {
  useWednesdayAttendanceCount,
  useUserCommentsInPeriod,
  useUserInfo,
  useBlogPostCompletion,
  usePeriodInfo,
  UserComment,
} from "../common";

// ========================================
// 타입 정의
// ========================================

export interface MemberDashboardSummary {
  user_id: string;
  user_name: string;
  email: string;
  is_admin: boolean;
  period_id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  blog_completed: number;
  comments_made: number;
  comments_completed: number;
  attendance_days: number;
  attendance_completed: number;
  completed_tasks: number;
  total_tasks: number;
  completion_rate: number;
  last_activity: string | null;
  minutes_since_last_activity: number | null;
  avatar_initial: string;
  progress_status: "completed" | "good" | "fair" | "poor";
}

export interface TeamSummaryStats {
  period_id: string;
  total_members: number;
  blog_completed_count: number;
  comments_completed_count: number;
  attendance_completed_count: number;
}

export const useMemberOnlineStatusQuery = (userId: string) => {
  const supabase = createClient();

  return useQuery<{ is_online: boolean; minutes_since_last_activity: number }>({
    queryKey: ["member-online-status", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_online_stats')
        .select('is_online, minutes_since_last_activity')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data || { is_online: false, minutes_since_last_activity: null };
    },
    refetchInterval: 1000 * 60 * 2, // 2분마다 업데이트
  });
};

/**
 * 개별 멤버의 대시보드 정보 조회 (공통 훅 사용)
 */
export const useMemberDashboardQuery = (userId: string, periodId: string) => {
  // 공통 훅들 사용
  const userInfoQuery = useUserInfo(userId);
  const blogCompletionQuery = useBlogPostCompletion(userId, periodId);
  const commentsQuery = useUserCommentsInPeriod(userId, periodId);
  const attendanceQuery = useWednesdayAttendanceCount(userId, periodId);
  const periodQuery = usePeriodInfo(periodId);

  return useQuery<MemberDashboardSummary>({
    queryKey: ["member-dashboard", userId, periodId],
    queryFn: async () => {
      const user = userInfoQuery.data;
      const blogPost = blogCompletionQuery.data;
      const comments = commentsQuery.data || [];
      const wednesdayAttendanceCount = attendanceQuery.data || 0;
      const period = periodQuery.data;

      if (!user || !period) {
        throw new Error("필요한 데이터를 불러올 수 없습니다");
      }

      // 계산 로직
      const blogCompleted = blogPost?.is_completed || false;
      const commentsMade = comments.length;
      const commentsCompleted = commentsMade >= 4; // 댓글 4개 이상

      const attendanceCompleted = wednesdayAttendanceCount >= 1; // 수요일 1회 이상 출석

      const completedTasks = [
        blogCompleted,
        commentsCompleted,
        attendanceCompleted,
      ].filter(Boolean).length;
      const totalTasks = 3;
      const completionRate = Math.round((completedTasks / totalTasks) * 100);

      const lastActivity = Math.max(
        ...comments.map((c: UserComment) => new Date(c.created_at).getTime()),
        0 // 수요일 출석은 시간 정보가 없으므로 제외
      );

      const progressStatus =
        completionRate === 100
          ? "completed"
          : completionRate >= 66
          ? "good"
          : completionRate >= 33
          ? "fair"
          : "poor";

      return {
        user_id: user.id,
        user_name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        period_id: periodId,
        year: period.year,
        month: period.month,
        start_date: period.start_date,
        end_date: period.end_date,
        blog_completed: blogCompleted ? 1 : 0,
        comments_made: commentsMade,
        comments_completed: commentsCompleted ? 1 : 0,
        attendance_days: wednesdayAttendanceCount, // 수요일 출석 횟수
        attendance_completed: attendanceCompleted ? 1 : 0,
        completed_tasks: completedTasks,
        total_tasks: totalTasks,
        completion_rate: completionRate,
        last_activity:
          lastActivity > 0 ? new Date(lastActivity).toISOString() : null,
        minutes_since_last_activity:
          lastActivity > 0
            ? Math.floor((Date.now() - lastActivity) / (1000 * 60))
            : null,
        avatar_initial: user.name.charAt(0),
        progress_status: progressStatus as
          | "completed"
          | "good"
          | "fair"
          | "poor",
      } as MemberDashboardSummary;
    },
    enabled: !!(userId && periodId && userInfoQuery.data && periodQuery.data),
    refetchInterval: 1000 * 60 * 5, // 5분마다 업데이트
  });
};

/**
 * 모든 사용자 목록만 가져오기 (MemberCard에서 개별 조회)
 */
export const useAllUsersQuery = () => {
  const supabase = createClient();

  return useQuery<
    { id: string; name: string; email: string; is_admin: boolean }[]
  >({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, is_admin")
        .order("name");

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10분간 캐시
  });
};

/**
 * 팀 전체 요약 통계 (간단한 계산만)
 */
export const useTeamSummaryStatsQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<TeamSummaryStats | null>({
    queryKey: ["team-summary-stats", periodId],
    queryFn: async () => {
      // 간단한 집계만 수행
      const [usersRes, blogPostsRes] =
        await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("blog_posts").select("user_id", {
            count: "exact",
            head: true,
          }),
        ]);

      const totalMembers = usersRes.count || 0;
      const blogCompletedCount = blogPostsRes.count || 0;

      // 간단한 통계만 반환
      return {
        period_id: periodId,
        total_members: totalMembers,
        blog_completed_count: blogCompletedCount,
        comments_completed_count: 0,
        attendance_completed_count: 0,
      } as TeamSummaryStats;
    },
    enabled: !!periodId,
  });
};
