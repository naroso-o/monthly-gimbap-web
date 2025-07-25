import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";

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