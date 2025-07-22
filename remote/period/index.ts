// remote/period/index.ts (기간 관련 쿼리 추가)
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";

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
export const useCurrentPeriodQuery = () => {
  const supabase = createClient();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const { queryKey } = queryKeys.period.current(currentYear, currentMonth);

  return useQuery<MonthlyPeriod | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_periods')
        .select('*')
        .eq('year', currentYear)
        .eq('month', currentMonth)
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
 * 특정 기간 정보 조회
 */
export const usePeriodQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<MonthlyPeriod | null>({
    queryKey: ['period', periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_periods')
        .select('*')
        .eq('id', periodId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!periodId,
  });
};