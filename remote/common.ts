import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";

// ========================================
// 공통 타입 정의
// ========================================

export interface CommonUser {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface UserComment {
  commenter_id: string;
  blog_post_id: string;
  created_at: string;
}

export interface BlogPostCompletion {
  id: string | null;
  is_completed: boolean;
  github_issue_url?: string;
  submitted_at?: string;
}

export interface PeriodInfo {
  id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
}

// ========================================
// 공통 훅들
// ========================================

/**
 * 수요일 출석 횟수 조회 (view_checklist_attendance_compat 뷰 사용)
 */
export const useWednesdayAttendanceCount = (userId: string, periodId: string) => {
  const supabase = createClient();

  return useQuery<number>({
    queryKey: ["common-wednesday-attendance", userId, periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("view_checklist_attendance_compat")
        .select("wednesday_count")
        .eq("period_id", periodId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data?.wednesday_count || 0;
    },
    enabled: !!(userId && periodId),
  });
};

/**
 * 특정 기간 내 사용자 댓글 조회 (RPC 함수 사용)
 */
export const useUserCommentsInPeriod = (userId: string, periodId: string) => {
  const supabase = createClient();

  return useQuery<UserComment[]>({
    queryKey: ["common-user-comments", userId, periodId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_user_comments_in_period",
        {
          p_user_id: userId,
          p_period_id: periodId,
        }
      );

      if (error) throw error;
      return data || [];
    },
    enabled: !!(userId && periodId),
  });
};

/**
 * 사용자 기본 정보 조회
 */
export const useUserInfo = (userId: string) => {
  const supabase = createClient();

  return useQuery<CommonUser | null>({
    queryKey: ["common-user-info", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, is_admin')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10분간 캐시
  });
};

/**
 * 블로그 포스트 완료 여부 조회
 */
export const useBlogPostCompletion = (userId: string, periodId: string) => {
  const supabase = createClient();

  return useQuery<BlogPostCompletion>({
    queryKey: ["common-blog-completion", userId, periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, github_issue_url, submitted_at')
        .eq('user_id', userId)
        .eq('period_id', periodId)
        .maybeSingle();

      if (error) throw error;

      return {
        id: data?.id || null,
        is_completed: !!data,
        github_issue_url: data?.github_issue_url,
        submitted_at: data?.submitted_at,
      };
    },
    enabled: !!(userId && periodId),
  });
};

/**
 * 기간 정보 조회
 */
export const usePeriodInfo = (periodId: string) => {
  const supabase = createClient();

  return useQuery<PeriodInfo | null>({
    queryKey: ["common-period-info", periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_periods')
        .select('id, year, month, start_date, end_date')
        .eq('id', periodId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!periodId,
    staleTime: 1000 * 60 * 30, // 30분간 캐시 (기간 정보는 자주 변경되지 않음)
  });
};

/**
 * 현재 인증된 사용자 ID 조회 (유틸리티)
 */
export const useCurrentUserId = () => {
  const supabase = createClient();

  return useQuery<string | null>({
    queryKey: ["common-current-user-id"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user?.id || null;
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
}; 