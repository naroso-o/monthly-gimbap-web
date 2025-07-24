"use client";

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
import { MessageCircle, CheckCircle2, Circle } from "lucide-react";
import { useModalStore } from "@/stores/useModalStore";
import {
  useUserCommentStatusQuery,
  useCommentTargetPostsQuery,
  ExtendedBlogPost,
} from "@/remote/comments";
import { useCurrentPeriodQuery } from "@/remote/period";
import { AvailablePostCard } from "./AvailablePostCard";

export const CommentModal = () => {
  const { data: currentPeriod } = useCurrentPeriodQuery();
  const { data: targetPosts = [] } = useCommentTargetPostsQuery(
    currentPeriod?.id || ""
  ) as { data: ExtendedBlogPost[] };
  const { data: userCommentStatus } = useUserCommentStatusQuery(
    currentPeriod?.id || ""
  );

  const { commentModalOpen, setCommentModalOpen } = useModalStore();

  const handleClose = () => {
    setCommentModalOpen(false);
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
            <MessageCircle className="w-5 h-5 text-diary-muted" />
            댓글 활동 체크
          </DialogTitle>
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
                  <AvailablePostCard key={post.id} post={post} />
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
