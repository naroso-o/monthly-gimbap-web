// remote/members/index.ts
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";

export interface MemberProgress {
    user_id: string;
    user_name: string;
    email: string;
    is_admin: boolean;
    period_id: string;
    year: number;
    month: number;
    completed_tasks: number;
    total_tasks: number;
    completion_rate: number;
    blog_completed: number;
    comments_completed: number;
    attendance_completed: number;
    comments_made: number;
    attendance_days: number;
    last_activity: string;
  }
  
  export interface MemberOnlineStatus {
    user_id: string;
    name: string;
    is_online: boolean;
    last_activity: string;
    minutes_since_last_activity: number;
  }

  export interface MemberDashboardSummary {
    user_id: string;
    user_name: string;
    email: string;
    is_admin: boolean;
    period_id: string;
    year: number;
    month: number;
    completed_tasks: number;
    total_tasks: number;
    completion_rate: number;
    blog_completed: number;
    comments_completed: number;
    attendance_completed: number;
    comments_made: number;
    attendance_days: number;
    last_activity: string;
    is_online: boolean;
    minutes_since_last_activity: number;
    avatar_initial: string;
    progress_status: 'completed' | 'good' | 'fair' | 'poor';
  }
  
  export interface TeamSummaryStats {
    period_id: string;
    year: number;
    month: number;
    total_members: number;
    online_members: number;
    avg_completion_rate: number;
    members_100_percent: number;
    members_66_to_99_percent: number;
    members_33_to_65_percent: number;
    members_below_33_percent: number;
    blog_completed_count: number;
    comments_completed_count: number;
    attendance_completed_count: number;
  }

  
/**
 * 특정 기간의 모든 멤버 진행 상황 조회
 */
export const useMemberProgressQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.members.progress(periodId);

  return useQuery<MemberProgress[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_monthly_progress')
        .select('*')
        .eq('period_id', periodId)
        .order('completion_rate', { ascending: false })
        .order('user_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!periodId,
  });
};

/**
 * 모든 멤버의 온라인 상태 조회
 */
export const useMemberOnlineStatusQuery = () => {
  const supabase = createClient();
  const { queryKey } = queryKeys.members.onlineStatus();

  return useQuery<MemberOnlineStatus[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_online_status')
        .select('*')
        .order('is_online', { ascending: false })
        .order('name');

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 1000 * 60 * 2, // 2분마다 자동 업데이트
  });
};

/**
 * 멤버 대시보드 종합 정보 조회 (진행 상황 + 온라인 상태)
 */
export const useMemberDashboardSummaryQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.members.summary(periodId);

  return useQuery<MemberDashboardSummary[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_dashboard_summary')
        .select('*')
        .eq('period_id', periodId)
        .order('completion_rate', { ascending: false })
        .order('user_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!periodId,
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 업데이트
  });
};

/**
 * 팀 전체 요약 통계 조회
 */
export const useTeamSummaryStatsQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.members.teamStats(periodId);

  return useQuery<TeamSummaryStats | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_summary_stats')
        .select('*')
        .eq('period_id', periodId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!periodId,
  });
};