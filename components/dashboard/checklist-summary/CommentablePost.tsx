import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useUserInfoQuery } from "@/remote/users";
import {
  ExtendedBlogPost,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/remote/comments";
import { useState } from "react";

export const CommentablePost = ({ post }: { post: ExtendedBlogPost }) => {
  const { data: user } = useUserInfoQuery(post.user_id);
  const { mutate: createComment } = useCreateCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();

  const [updatingPostId, setUpdatingPostId] = useState<string | null>(null);

  const handleCheckComment = async (post: ExtendedBlogPost) => {
    setUpdatingPostId(post.id);

    try {
      if (post.has_commented) {
        // 댓글 기록을 삭제 - comment_records 테이블에서 해당 레코드를 찾아서 삭제
        deleteComment({
          blogPostId: post.id,
          commenterId: user?.id || "",
        });
      } else {
        createComment({ blogPostId: post.id });
      }
    } catch (err) {
      console.error("댓글 상태 업데이트 중 오류:", err);
    } finally {
      setUpdatingPostId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div
      key={post.id}
      className="flex items-center gap-3 p-3 bg-diary-card border border-diary-border rounded-lg hover:bg-diary-border/10 transition-colors"
    >
      {/* 댓글 완료 체크박스 */}
      <button
        onClick={() => handleCheckComment(post)}
        disabled={updatingPostId === post.id}
        className="flex-shrink-0 p-1 hover:bg-diary-border/30 rounded transition-colors"
      >
        {post.has_commented ? (
          <CheckCircle2 className="w-5 h-5 text-diary-accent" />
        ) : (
          <Circle className="w-5 h-5 text-diary-muted" />
        )}
      </button>

      {/* 글 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-diary-text truncate">
            PR {post.github_issue_url.split("/").pop() || "GitHub Issue"}
          </span>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {user?.name || "Unknown"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-diary-muted">
          <span>{formatDate(post.submitted_at || "")}</span>
          {post.has_commented && (
            <span className="text-diary-accent">• 댓글 완료</span>
          )}
        </div>
      </div>

      {/* 바로가기 버튼 */}
      <button
        onClick={() =>
          window.open(post.github_issue_url, "_blank", "noopener,noreferrer")
        }
        className="flex-shrink-0 p-2 hover:bg-diary-border/30 rounded transition-colors group"
        title="블로그 글 보기"
      >
        <ExternalLink className="w-4 h-4 text-diary-muted group-hover:text-diary-text" />
      </button>
    </div>
  );
};
