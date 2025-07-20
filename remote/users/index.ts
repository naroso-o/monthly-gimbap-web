import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "../keys";
import { User } from "@/types";

// 유저 정보 조회
export const useUserQuery = () => {
  const supabase = createClient();
  const { queryKey } = queryKeys.users.information();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;
      if (!data?.user) return null;

      // 사용자 정보 정규화
      return {
        id: data.user.id,
        email: data.user.email || "",
        name:
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "사용자",
        is_admin: data.user.user_metadata?.is_admin || false,
        created_at: data.user.created_at || "",
        updated_at: data.user.updated_at || "",
      };
    },
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30, 
  });
};

// 사용자 메타데이터 업데이트
export const useUpdateUserMutation = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { queryKey } = queryKeys.users.information();

  return useMutation({
    mutationFn: async (updates: { name?: string; is_admin?: boolean }) => {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) throw error;
      return data;
    },
    onMutate: async (updates) => {
      // 진행 중인 쿼리들을 취소
      await queryClient.cancelQueries({ queryKey });

      // 이전 데이터 백업
      const previousUser = queryClient.getQueryData(queryKey);

      // Optimistic update
      queryClient.setQueryData(queryKey, (old: User | null) => {
        if (!old) return old;
        return {
          ...old,
          ...updates,
        };
      });

      return { previousUser };
    },
    onError: (err, updates, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousUser) {
        queryClient.setQueryData(queryKey, context.previousUser);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 데이터 다시 fetch
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
