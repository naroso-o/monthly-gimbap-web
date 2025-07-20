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

export interface ChecklistAttendance {
  id: string;
  user_id: string;
  period_id: string;
  is_completed: boolean;
  wednesday_count: number;
  total_attendance_count: number;
  created_at: string;
  updated_at: string;
}

export const useAttendanceCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.checklist.attendance(periodId);

  return useQuery<ChecklistAttendance | null>({
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
    enabled: !!periodId,
  });
};

export interface ChecklistComment {
  id: string;
  user_id: string;
  period_id: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useCommentsCheckQuery = (periodId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.checklist.comments(periodId);

  return useQuery<ChecklistComment | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_comments")
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

export interface CommentCheck {
  id: string;
  checklist_comment_id: string;
  commenter_id: string;
  target_user_id: string;
  created_at: string;
}

export const useCommentsQuery = (commentId: string) => {
  const supabase = createClient();
  const { queryKey } = queryKeys.checklist.comments(commentId);

  return useQuery<CommentCheck[] | null>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comment_checks")
        .select("*")
        .eq("checklist_comment_id", commentId);

      if (error) throw error;

      return data;
    },
    enabled: !!commentId,
  });
};
