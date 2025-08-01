import { MessageCircle } from "lucide-react";
import { ChecklistCard } from "./ChecklistCard";
import { Button } from "@/components/ui/button";
import { useUserCommentStatusQuery } from "@/remote/comments";
import { useModalStore } from "@/stores/useModalStore";
import { usePeriodStore } from "../../../stores/usePeriodStore";

export const CommentsCard = () => {
  const { setCommentModalOpen } = useModalStore();
  const { previousId } = usePeriodStore();
  const { data: userCommentStatus } = useUserCommentStatusQuery(previousId || "");

  return (
    <ChecklistCard
      title="댓글 활동"
      icon={<MessageCircle className="w-5 h-5 text-stone-600" />}
      description={`월 4명 이상에게 댓글 달기 (${userCommentStatus?.comments_given || 0}/4)`}
      isCompleted={userCommentStatus?.comments_given && userCommentStatus.comments_given >= 4 || false}
      button={
        <Button
          variant="primary"
          size="sm"
          className="w-full text-sm"
          onClick={() => {
            setCommentModalOpen(true);
          }}
        >
          {userCommentStatus?.comments_given && userCommentStatus.comments_given >= 4 ? "완료!" : "댓글 작성하기"}
        </Button>
      }
    />
  );
};
