import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { createClient } from "@/utils/supabase/client";

export const useCurrentPeriod = () => {
  const supabase = createClient();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  console.log(year, month);

  const { queryKey } = queryKeys.period.current(year, month);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_periods")
        .select("id, start_date, end_date")
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
