import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserQuery } from "../users";
import { useCurrentPeriodQuery } from "../period";

export interface CreatePost {
  issueUrl: string;
}

export const useBlogPostsQuery = (periodId: string) => {
  const supabase = createClient();
  const { data: user } = useUserQuery();

  return useQuery({
    queryKey: ["blog_posts", periodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("user_id", user?.id)
        .eq("period_id", periodId);
      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePostMutation = () => {
  const supabase = createClient();
  const { data: user } = useUserQuery();
  const { data: currentPeriod } = useCurrentPeriodQuery();

  return useMutation({
    mutationFn: async (post: CreatePost) => {
      if (!user || !currentPeriod) throw new Error("User or period not found");

      const { data, error } = await supabase.from("blog_posts").insert({
        user_id: user?.id,
        period_id: currentPeriod?.id,
        github_issue_url: post.issueUrl,
      });
      if (error) throw error;
      return data;
    },
  });
};
