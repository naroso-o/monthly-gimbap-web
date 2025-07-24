import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserQuery } from "../users";
import { useCurrentPeriodQuery } from "../period";
import { useBlogPostCompletion } from "../common";

export interface BlogPost {
  id: string;
  user_id: string;
  period_id: string;
  github_issue_url: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePost {
  issueUrl: string;
}

// 블로그 포스트 완료 여부를 확인하는 쿼리 (공통 훅 사용)
export const useBlogPostCheckQuery = (periodId: string) => {
  const { data: user } = useUserQuery();
  
  // 공통 훅을 사용하되, 기존 인터페이스 호환성을 위해 래퍼 형태로 제공
  const blogCompletionQuery = useBlogPostCompletion(user?.id || '', periodId);

  return useQuery({
    queryKey: ["blog_post_check", periodId, user?.id],
    queryFn: async () => {
      if (!user || !blogCompletionQuery.data) return null;

      const completion = blogCompletionQuery.data;
      return {
        id: completion.id,
        user_id: user.id,
        period_id: periodId,
        is_completed: completion.is_completed,
        github_issue_url: completion.github_issue_url,
        completed_at: completion.submitted_at,
        created_at: null, // 공통 훅에서는 제공하지 않음
        updated_at: null, // 공통 훅에서는 제공하지 않음
      };
    },
    enabled: !!periodId && !!user && !!blogCompletionQuery.data,
  });
};

export const useTotalBlogPostsQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  
  return useQuery({
    queryKey: ["total_blog_posts", periodId, user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_id", periodId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!periodId && !!user,
  });
};

export const useBlogPostsQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();

  return useQuery({
    queryKey: ["blog_posts", periodId, user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_id", periodId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!periodId && !!user,
  });
};

export const useCreatePostMutation = () => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { data: currentPeriod } = useCurrentPeriodQuery();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: CreatePost) => {
      if (!user || !currentPeriod) throw new Error("User or period not found");

      const { data, error } = await supabase.from("blog_posts").insert({
        user_id: user.id,
        period_id: currentPeriod.id,
        github_issue_url: post.issueUrl,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 관련 쿼리들을 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: ["blog_post_check", currentPeriod?.id, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["blog_posts", currentPeriod?.id, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["total_blog_posts", currentPeriod?.id, user?.id],
      });
    },
  });
};