import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { createClient } from "@/utils/supabase/client";

export interface MonthlyPeriod {
  id: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const useCurrentPeriodQuery = (year: number, month: number) => {
  const supabase = createClient();

  const { queryKey } = queryKeys.period.current(year, month);

  return useQuery<MonthlyPeriod | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_periods")
        .select("id, start_date, end_date, created_at")
        .eq("year", year)
        .eq("month", month)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
