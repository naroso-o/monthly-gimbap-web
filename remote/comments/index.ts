import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../utils/supabase/client";

export interface CommentRecord {
  id: string;
  commenter_id: string;
  blog_post_id: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  user_id: string;
  period_id: string;
  github_issue_url: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface ExtendedBlogPost extends BlogPost {
  has_commented?: boolean;
  author_name?: string;
}

export interface MonthlyCommentStats {
  user_id: string;
  user_name: string;
  period_id: string;
  year: number;
  month: number;
  total_comments_given: number;
  unique_posts_commented: number;
  total_comments_received: number;
  is_completed: boolean;
}

export interface UserCommentStatus {
  comments_given: number;
  unique_posts_commented: number;
  comments_received: number;
  is_completed: boolean;
  target_posts: Array<{
    blog_post_id: string;
    blog_post_url: string;
    author_name: string;
    commented_at: string;
  }>;
}

// 기존 호환성을 위한 인터페이스
export interface ChecklistComments {
  id: string;
  user_id: string;
  period_id: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

// ========================================
// 2. React Query 훅들
// ========================================

// 사용자별 댓글 현황 조회
export const useUserCommentStatusQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<UserCommentStatus>({
    queryKey: ["user-comment-status", periodId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_user_comment_status", {
        p_user_id: user.user.id,
        p_period_id: periodId,
      });

      if (error) throw error;

      return (
        data?.[0] || {
          comments_given: 0,
          unique_posts_commented: 0,
          comments_received: 0,
          is_completed: false,
          target_posts: [],
        }
      );
    },
    enabled: !!periodId,
  });
};

// 월별 댓글 통계 조회
export const useMonthlyCommentStatsQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<MonthlyCommentStats>({
    queryKey: ["monthly-comment-stats", periodId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("view_monthly_comment_stats")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("period_id", periodId)
        .maybeSingle();

      if (error) throw error;

      return (
        data || {
          user_id: user.user.id,
          user_name: "",
          period_id: periodId,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          total_comments_given: 0,
          unique_posts_commented: 0,
          total_comments_received: 0,
          is_completed: false,
        }
      );
    },
    enabled: !!periodId,
  });
};

// 특정 포스트의 댓글들 조회
export const usePostCommentsQuery = (blogPostId: string) => {
  const supabase = createClient();

  return useQuery<Array<CommentRecord & { commenter_name: string }>>({
    queryKey: ["post-comments", blogPostId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comment_records")
        .select(
          `
            *,
            users!commenter_id (
              name
            )
          `
        )
        .eq("blog_post_id", blogPostId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((comment) => ({
        ...comment,
        commenter_name: comment.users?.name || "Unknown",
      }));
    },
    enabled: !!blogPostId,
  });
};

// 댓글 대상이 될 수 있는 포스트들 조회 (다른 사용자의 포스트)
export const useCommentTargetPostsQuery = (periodId: string) => {
  const supabase = createClient();

  return useQuery<
    Array<BlogPost & { author_name: string; has_commented: boolean }>
  >({
    queryKey: ["comment-target-posts", periodId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
            *,
            users!user_id (
              name
            ),
            comment_records!blog_post_id (
              commenter_id
            )
          `
        )
        .eq("period_id", periodId)
        .neq("user_id", user.user.id) // 본인 포스트 제외
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((post) => ({
        ...post,
        author_name: post.users?.name || "Unknown",
        has_commented:
          post.comment_records?.some(
            (comment: { commenter_id: string }) =>
              comment.commenter_id === user.user.id
          ) || false,
      }));
    },
    enabled: !!periodId,
  });
};

// 댓글 기록 생성 (단순화)
export const useCreateCommentMutation = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogPostId }: { blogPostId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("comment_records")
        .insert({
          commenter_id: user.user.id,
          blog_post_id: blogPostId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ["user-comment-status"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-comment-stats"] });
      queryClient.invalidateQueries({ queryKey: ["checklist", "comments"] });
      queryClient.invalidateQueries({
        queryKey: ["post-comments", variables.blogPostId],
      });
      queryClient.invalidateQueries({ queryKey: ["comment-target-posts"] });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogPostId, commenterId }: { blogPostId: string; commenterId: string }) => {
      const { error } = await supabase
        .from("comment_records")
        .delete()
        .eq("blog_post_id", blogPostId)
        .eq("commenter_id", commenterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-comment-status"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-comment-stats"] });
      queryClient.invalidateQueries({ queryKey: ["checklist", "comments"] });
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
      queryClient.invalidateQueries({ queryKey: ["comment-target-posts"] });
    },
  });
};
