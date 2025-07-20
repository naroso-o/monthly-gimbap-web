import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { auth } from "../../utils/supabase/serverAuth";

export const prefetchUser = async (queryClient: QueryClient) => {
  const { queryKey } = queryKeys.users.information();
  
  return await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await auth.getUser();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}; 