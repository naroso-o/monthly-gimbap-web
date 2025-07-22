import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserQuery } from "../users";
import { useCurrentPeriodQuery } from "../period";

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

// 블로그 포스트 완료 여부를 확인하는 쿼리 (기존 useBlogPostCheckQuery 대체)
export const useBlogPostCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();

  return useQuery({
    queryKey: ["blog_post_check", periodId, user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_id", periodId)
        .maybeSingle();

      if (error) throw error;

      // 블로그 포스트가 존재하면 완료된 것으로 간주
      return {
        id: data?.id || null,
        user_id: user.id,
        period_id: periodId,
        is_completed: !!data,
        github_issue_url: data?.github_issue_url,
        completed_at: data?.submitted_at,
        created_at: data?.created_at,
        updated_at: data?.updated_at,
      };
    },
    enabled: !!periodId && !!user,
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