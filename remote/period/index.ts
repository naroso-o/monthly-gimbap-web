// remote/period/index.ts (기간 관련 쿼리 추가)
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { usePeriodInfo } from "../common";

export interface MonthlyPeriod {
  id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

/**
 * 현재 년월에 해당하는 기간 조회
 */
export const usePeriodIdQuery = (year: number, month: number) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.period.current(year, month);

  return useQuery<MonthlyPeriod | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_periods')
        .select('*')
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

/**
 * 모든 기간 목록 조회 (최신순)
 */
export const useAllPeriodsQuery = () => {
  const supabase = createClient();

  return useQuery<MonthlyPeriod[]>({
    queryKey: ['periods', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_periods')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

/**
 * 특정 기간 정보 조회 (공통 훅 사용)
 */
export const usePeriodQuery = (periodId: string) => {
  // 공통 훅을 사용하되, 기존 인터페이스 호환성을 위해 래퍼 형태로 제공
  const periodInfoQuery = usePeriodInfo(periodId);

  return useQuery<MonthlyPeriod | null>({
    queryKey: ['period', periodId],
    queryFn: async () => {
      const periodInfo = periodInfoQuery.data;
      if (!periodInfo) return null;

      // MonthlyPeriod 인터페이스에 맞게 변환 (created_at 필드 추가 필요시)
      return {
        ...periodInfo,
        created_at: '', // 공통 훅에서는 제공하지 않음, 필요시 별도 조회
      } as MonthlyPeriod;
    },
    enabled: !!periodId && !!periodInfoQuery.data,
  });
};