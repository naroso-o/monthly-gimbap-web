import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { createClient } from "@/utils/supabase/client";

export interface ChecklistBlogPost {
  id: string;
  user_id: string;
  period_id: string;
  is_completed: boolean;
  github_issue_url?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useBlogPostCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.checklist.blogPost(periodId);

  return useQuery<ChecklistBlogPost | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_blog_posts")
        .select("*")
        .eq("period_id", periodId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return {
          id: null,
          period_id: periodId,
          is_completed: false,
        };
      }

      return data;
    },
    enabled: !!periodId,
  });
};
