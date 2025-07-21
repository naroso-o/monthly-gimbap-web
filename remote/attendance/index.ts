import { createClient } from "../../utils/supabase/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "../keys";

// 기존 호환성을 위한 인터페이스
export interface ChecklistAttendance {
  id: string;
  user_id: string;
  period_id: string;
  is_completed: boolean;
  wednesday_count: number;
  total_attendance_count: number;
  created_at: string;
  updated_at: string;
}

export interface DailyAttendanceStats {
  user_id: string;
  period_id: string;
  attendance_date: string;
  day_of_week: number;
  session_count: number;
  total_hours: number;
  attended_23_24: boolean;
}

// 오늘의 출석 기록 상세
export interface DailyAttendanceDetail {
  id: string;
  user_id: string;
  period_id: string;
  attendance_date: string;
  time: string;
  type: "start" | "end";
  is_auto_generated: boolean;
  time_display: string;
  type_display: string;
  session_hours: number | null;
}

// 일별 출석 요약 (전체 datetime 받기)
export interface DailyAttendanceSummary {
  session_count: number;
  current_status: "start" | "end" | "restart";
  sessions: Array<{
    time: string; // 전체 UTC datetime ISO string (2025-01-23T14:23:00Z 형태)
    type: string;
  }>;
}

export const useAttendanceCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.checklist.attendance(periodId);

  return useQuery<ChecklistAttendance | null>({
    queryKey,
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("view_checklist_attendance_compat")
        .select("*")
        .eq("period_id", periodId)
        .eq("user_id", user.user.id)
        .maybeSingle();

      if (error) throw error;

      // 데이터가 없으면 기본값 반환
      if (!data) {
        return {
          id: `${user.user.id}_${periodId}`,
          user_id: user.user.id,
          period_id: periodId,
          wednesday_count: 0,
          total_attendance_count: 0,
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      return data;
    },
    enabled: !!periodId,
  });
};

// 수요일 출석 횟수 쿼리
export const useWednesdayAttendanceQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<number>({
    queryKey: ["wednesday-attendance", periodId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc(
        "get_wednesday_attendance_count",
        {
          p_user_id: user.user.id,
          p_period_id: periodId,
        }
      );

      if (error) throw error;
      return data || 0;
    },
    enabled: !!periodId,
  });
};

// 캘린더용 일별 통계 쿼리
export const useDailyAttendanceStatsQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<DailyAttendanceStats[]>({
    queryKey: ["daily-attendance-stats", periodId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("view_daily_attendance_stats")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("period_id", periodId)
        .order("attendance_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!periodId,
  });
};

// 현재 출석 상태 쿼리 (시간대 변환 제거)
export const useAttendanceStatusQuery = (date?: string) => {
  const supabase = createClient();

  return useQuery<"start" | "end" | "restart">({
    queryKey: ["attendance-status", date],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      // 원본 ISO 날짜 문자열 그대로 사용
      const targetDate = date || new Date().toISOString().split('T')[0];

      const { data, error } = await supabase.rpc("get_attendance_status", {
        p_user_id: user.user.id,
        p_date: targetDate,
      });

      if (error) throw error;
      return data || "start";
    },
    refetchInterval: 30000, // 30초마다 상태 확인
  });
};

// 오늘의 출석 기록 상세 쿼리 (한국 시간대 고려)
export const useDailyAttendanceDetailQuery = (date?: string) => {
  const supabase = createClient();

  return useQuery<DailyAttendanceDetail[]>({
    queryKey: ["daily-attendance-detail", date],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      // 한국 시간 기준으로 날짜 계산
      const targetDate = date || new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD 형식

      const { data, error } = await supabase
        .from("view_daily_attendance_detail")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("attendance_date", targetDate)
        .order("time", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

// 오늘의 출석 요약 쿼리
export const useDailyAttendanceSummaryQuery = (date?: string) => {
  const supabase = createClient();

  return useQuery<DailyAttendanceSummary>({
    queryKey: ["daily-attendance-summary", date],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const targetDate = date || new Date().toISOString().split("T")[0];

      const { data, error } = await supabase.rpc(
        "get_daily_attendance_summary",
        {
          p_user_id: user.user.id,
          p_date: targetDate,
        }
      );

      if (error) throw error;

      return (
        data?.[0] || {
          session_count: 0,
          current_status: "start" as const,
          sessions: [],
        }
      );
    },
    refetchInterval: 60000, // 1분마다 갱신
  });
};

// ========================================
// Mutation 훅들
// ========================================

// 출석 체크인/체크아웃
export const useAttendanceMutation = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      periodId,
      type,
    }: {
      periodId: string;
      type: "start" | "end";
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("attendance_records")
        .insert({
          user_id: user.user.id,
          period_id: periodId,
          type,
          time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const today = new Date().toISOString().split("T")[0];
      
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ["attendance-status"] });
      queryClient.invalidateQueries({ queryKey: ["daily-attendance-summary"] });
      queryClient.invalidateQueries({ queryKey: ["daily-attendance-detail"] });
      queryClient.invalidateQueries({ queryKey: ["checklist", "attendance"] });
      queryClient.invalidateQueries({ queryKey: ["wednesday-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["daily-attendance-stats"] });
      
      // 특정 날짜 쿼리들도 무효화
      queryClient.invalidateQueries({ queryKey: ["attendance-status", today] });
      queryClient.invalidateQueries({ queryKey: ["daily-attendance-summary", today] });
      queryClient.invalidateQueries({ queryKey: ["daily-attendance-detail", today] });
      
      // 해당 period의 데이터도 무효화
      queryClient.invalidateQueries({ queryKey: ["wednesday-attendance", variables.periodId] });
      queryClient.invalidateQueries({ queryKey: ["daily-attendance-stats", variables.periodId] });
    },
  });
};