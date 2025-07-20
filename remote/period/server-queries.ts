import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { period } from "@/utils/supabase/serverPeriod";

export const prefetchPeriod = async (queryClient: QueryClient) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { queryKey } = queryKeys.period.current(year, month);

  return await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await period.getCurrentPeriod();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};