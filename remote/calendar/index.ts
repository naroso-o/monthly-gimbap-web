import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useUserQuery } from "../users";
import { queryKeys } from "../keys";

export interface CalendarAttendanceData {
  [key: string]: {
    attended: boolean;
    duration: number;
    first_record?: string;
    last_record?: string;
    total_records?: number;
  };
}

export interface CalendarPeriodData {
  user_id: string;
  user_name: string;
  period_id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  attendance_data: CalendarAttendanceData;
  total_attendance_days: number;
  total_minutes: number;
  avg_minutes: number;
}

export interface DailyAttendanceDetail {
  user_id: string;
  period_id: string;
  attendance_date: string;
  first_record_time?: string;
  last_record_time?: string;
  attended: boolean;
  duration_minutes: number;
  total_records: number;
  year: number;
  month: number;
}

export interface MonthlyAttendanceSummary {
  user_id: string;
  period_id: string;
  year: number;
  month: number;
  attendance_days: number;
  total_duration_minutes: number;
  avg_duration_minutes: number;
  max_duration_minutes: number;
  min_duration_minutes?: number;
  earliest_record_time?: string;
  latest_record_time?: string;
}

/**
 * 캘린더용 기간 출석 데이터 조회
 * 특정 기간(월)의 모든 출석 데이터를 JSON 형태로 반환
 */
export const useCalendarAttendanceQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { queryKey } = queryKeys.calendar.periodAttendance(periodId, user?.id);

  return useQuery<CalendarPeriodData | null>({
    queryKey,
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("calendar_period_attendance")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_id", periodId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!periodId,
  });
};

/**
 * 특정 날짜의 상세 출석 정보 조회
 */
export const useDailyAttendanceQuery = (date: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { queryKey } = queryKeys.calendar.dailyAttendance(date, user?.id);

  return useQuery<DailyAttendanceDetail | null>({
    queryKey,
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("calendar_daily_attendance")
        .select("*")
        .eq("user_id", user.id)
        .eq("attendance_date", date)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!date,
  });
};

/**
 * 월간 출석 요약 조회
 */
export const useMonthlyAttendanceSummaryQuery = (
  year: number,
  month: number
) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { queryKey } = queryKeys.calendar.monthlyAttendance(
    year,
    month,
    user?.id
  );

  return useQuery<MonthlyAttendanceSummary | null>({
    queryKey,
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("calendar_monthly_summary")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", year)
        .eq("month", month)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!year && !!month,
  });
};

/**
 * 현재 월의 출석 데이터 조회 (편의 함수)
 */
export const useCurrentMonthAttendanceQuery = (periodId: string) => {
  return useCalendarAttendanceQuery(periodId);
};

/**
 * 여러 사용자의 출석 현황 조회 (관리자용 또는 팀 뷰용)
 */
export const useTeamCalendarAttendanceQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.calendar.teamAttendance(periodId);

  return useQuery<CalendarPeriodData[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_period_attendance")
        .select("*")
        .eq("period_id", periodId)
        .order("user_name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!periodId,
  });
};

/**
 * 사용자별 출석 통계 조회 (대시보드용)
 */
export const useUserAttendanceStatsQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { queryKey } = queryKeys.calendar.userStats(periodId, user?.id);

  return useQuery<{
    attendance_days: number;
    total_duration_minutes: number;
    avg_duration_minutes: number;
    attendance_rate: number;
  } | null>({
    queryKey,
    queryFn: async () => {
      if (!user) return null;

      // 월간 요약에서 통계 계산
      const { data: summary, error } = await supabase
        .from("calendar_monthly_summary")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_id", periodId)
        .maybeSingle();

      if (error) throw error;
      if (!summary) return null;

      // 해당 월의 총 일수 계산 (간단히 30일로 가정)
      const totalDaysInMonth = 30;
      const attendanceRate = Math.round(
        (summary.attendance_days / totalDaysInMonth) * 100
      );

      return {
        attendance_days: summary.attendance_days,
        total_duration_minutes: summary.total_duration_minutes,
        avg_duration_minutes: summary.avg_duration_minutes,
        attendance_rate: attendanceRate,
      };
    },
    enabled: !!user && !!periodId,
  });
};

/**
 * 특정 기간의 출석 일정 목록 조회 (출석한 날짜들만)
 */
export const useAttendanceDaysQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { queryKey } = queryKeys.calendar.attendanceDays(periodId, user?.id);

  return useQuery<string[]>({
    queryKey,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("calendar_daily_attendance")
        .select("attendance_date")
        .eq("user_id", user.id)
        .eq("period_id", periodId)
        .order("attendance_date", { ascending: true });

      if (error) throw error;

      return data?.map((item) => item.attendance_date) || [];
    },
    enabled: !!user && !!periodId,
  });
};
