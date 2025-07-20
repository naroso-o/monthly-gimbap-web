import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../keys";
import { createClient } from "@/utils/supabase/client";

export const useBlogPostCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { queryKey } = queryKeys.checklist.blogPost(year, month);

  return useQuery({
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
    },
  });
};

export const useAttendanceCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { queryKey } = queryKeys.checklist.attendance(year, month);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_attendances")
        .select("*")
        .eq("period_id", periodId)
        .maybeSingle();

      if (error) throw error;

      // 데이터가 없으면 기본값 반환
      if (!data) {
        return {
          id: null,
          period_id: periodId,
          wednesday_count: 0,
          is_completed: false,
        };
      }

      return data;
    },
  });
};

export const useCommentsCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { queryKey } = queryKeys.checklist.comments(year, month);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_comments")
        .select("is_completed")
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
    },
  });
};

export const useCommentsQuery = (commentId: string) => {
  const supabase = createClient();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { queryKey } = queryKeys.checklist.comments(year, month);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comment_checks")
        .select("*")
        .eq("checklist_comment_id", commentId);

      if (error) throw error;

      return data;
    },
  });
};
