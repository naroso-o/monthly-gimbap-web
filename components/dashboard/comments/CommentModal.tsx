"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useModalStore } from "@/stores/useModalStore";
import {
  useCreateCommentMutation,
  useUserCommentStatusQuery,
  useCommentTargetPostsQuery,
  BlogPost,
  useDeleteCommentMutation,
} from "@/remote/comments";
import { useCurrentPeriodQuery } from "@/remote/period";
import { useUserQuery } from "@/remote/users";

// BlogPost 타입을 확장하여 has_commented 속성 추가
interface ExtendedBlogPost extends BlogPost {
  has_commented?: boolean;
  author_name?: string;
}

export const CommentModal = () => {
  const { data: currentPeriod } = useCurrentPeriodQuery();
  const { data: targetPosts = [] } = useCommentTargetPostsQuery(
    currentPeriod?.id || ""
  ) as { data: ExtendedBlogPost[] };
  const { data: userCommentStatus } = useUserCommentStatusQuery(
    currentPeriod?.id || ""
  );
  const { data: user } = useUserQuery();

  const { mutate: createComment } = useCreateCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();

  const { commentModalOpen, setCommentModalOpen } = useModalStore();
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

  const handleClose = () => {
    setCommentModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  // 작성자별 댓글 현황 계산
  const authorStats = targetPosts.reduce((acc, post) => {
    const authorName = post.author_name || "Unknown";
    if (!acc[authorName]) {
      acc[authorName] = {
        total: 0,
        commented: 0,
      };
    }
    acc[authorName].total++;
    if (post.has_commented) {
      acc[authorName].commented++;
    }
    return acc;
  }, {} as Record<string, { total: number; commented: number }>);

  const uniqueAuthorsCommented = Object.values(authorStats).filter(
    (stat) => stat.commented > 0
  ).length;

  const totalAuthors = Object.keys(authorStats).length;

  return (
    <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white">
        <DialogClose onClick={handleClose} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {userCommentStatus?.is_completed ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-diary-accent" />
                댓글 활동 완료!
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 text-diary-muted" />
                댓글 활동 체크
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {userCommentStatus?.is_completed
              ? `이번 달 댓글 활동을 완료하셨습니다! (${uniqueAuthorsCommented}명/${totalAuthors}명) 🎉`
              : `멤버들의 블로그 글에 댓글을 달고 체크해주세요. (현재 ${uniqueAuthorsCommented}명/${totalAuthors}명)`}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          {/* 통계 정보 */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-diary-border/10 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-diary-text">
                {userCommentStatus?.comments_given || 0}
              </div>
              <div className="text-xs text-diary-muted">작성한 댓글</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-diary-text">
                {userCommentStatus?.unique_posts_commented || 0}
              </div>
              <div className="text-xs text-diary-muted">댓글 단 포스트</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-diary-text">
                {userCommentStatus?.comments_received || 0}
              </div>
              <div className="text-xs text-diary-muted">받은 댓글</div>
            </div>
          </div>

          {/* 블로그 글 리스트 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-diary-text">
                이번 달 블로그 글 목록
              </h4>
              <Badge variant="outline" className="text-xs">
                {targetPosts.length}개
              </Badge>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 border border-diary-border rounded-lg p-2">
              {targetPosts.length === 0 ? (
                <div className="text-center py-8 text-diary-muted">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    아직 댓글을 달 수 있는 블로그 글이 없습니다.
                  </p>
                </div>
              ) : (
                targetPosts.map((post) => (
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
                          {post.github_issue_url?.split("/").pop() ||
                            "GitHub Issue"}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs flex-shrink-0"
                        >
                          {post.author_name || "Unknown"}
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
                        window.open(
                          post.github_issue_url,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="flex-shrink-0 p-2 hover:bg-diary-border/30 rounded transition-colors group"
                      title="블로그 글 보기"
                    >
                      <ExternalLink className="w-4 h-4 text-diary-muted group-hover:text-diary-text" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 작성자별 댓글 현황 */}
          {totalAuthors > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-diary-text">
                작성자별 댓글 현황
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(authorStats).map(([authorName, stats]) => {
                  const hasComment = stats.commented > 0;

                  return (
                    <div
                      key={authorName}
                      className={`flex items-center justify-between p-2 rounded-lg border ${
                        hasComment
                          ? "bg-green-50 border-green-200"
                          : "bg-diary-card border-diary-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {hasComment ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-diary-muted" />
                        )}
                        <span className="text-sm font-medium text-diary-text">
                          {authorName}
                        </span>
                      </div>
                      <span className="text-xs text-diary-muted">
                        {stats.commented}/{stats.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 완료 상태 메시지 */}
          {userCommentStatus?.is_completed && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium mb-1">댓글 활동 완료!</p>
              <p className="text-green-600 text-sm">
                {userCommentStatus.unique_posts_commented}개의 포스트에 댓글을
                달아주셨어요. 활발한 소통 감사합니다! 🎉
              </p>
            </div>
          )}

          {/* 닫기 버튼 */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleClose} className="px-6">
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
