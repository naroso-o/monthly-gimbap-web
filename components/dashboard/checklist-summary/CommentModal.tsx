"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useModalStore } from "@/stores/useModalStore";
import {
  useUserCommentStatusQuery,
  useCommentTargetPostsQuery,
  ExtendedBlogPost,
} from "@/remote/comments";
import { CommentablePost } from "./CommentablePost";
import { usePeriodStore } from "../../../stores/usePeriodStore";

export const CommentModal = () => {
  const { previousId } = usePeriodStore();

  const { data: targetPosts = [] } = useCommentTargetPostsQuery(
    previousId || ""
  ) as { data: ExtendedBlogPost[] };
  const { data: userCommentStatus } = useUserCommentStatusQuery(
    previousId || ""
  );

  const { commentModalOpen, setCommentModalOpen } = useModalStore();

  const handleClose = () => {
    setCommentModalOpen(false);
  };

  return (
    <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white flex flex-col">
        <DialogClose onClick={handleClose} />
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-diary-muted" />
            댓글 활동 체크
          </DialogTitle>
        </DialogHeader>

        {/* 메인 콘텐츠 영역 */}
        <div className="px-6 pb-6 space-y-6">
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

          <div>
            {/* 블로그 글 리스트 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-diary-text">
                  저번 달 블로그 글 목록
                </h4>
                <Badge variant="outline" className="text-xs">
                  {targetPosts.length}개
                </Badge>
              </div>

              {targetPosts.length === 0 ? (
                <div className="text-center py-12 text-diary-muted">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    아직 댓글을 달 수 있는 블로그 글이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {targetPosts.map((post) => (
                    <CommentablePost key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 확인 버튼 */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleClose} className="px-6">
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};