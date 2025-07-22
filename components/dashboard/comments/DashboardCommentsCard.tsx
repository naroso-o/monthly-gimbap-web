import { MessageCircle } from "lucide-react";
import { DashboardCard } from "../DashboardCard";
import { Button } from "@/components/ui/button";
import { useUserCommentStatusQuery } from "@/remote/comments";
import { useModalStore } from "@/stores/useModalStore";

export const DashboardCommentsCard = ({ periodId }: { periodId: string }) => {
  const { setCommentModalOpen } = useModalStore();
  const { data: userCommentStatus } = useUserCommentStatusQuery(periodId);

  return (
    <DashboardCard
      title="댓글 활동"
      icon={<MessageCircle className="w-5 h-5 text-stone-600" />}
      description={`월 4명 이상에게 댓글 달기 (${userCommentStatus?.target_posts?.length || 0}/4)`}
      isCompleted={userCommentStatus?.is_completed || false}
      button={
        <Button
          variant="primary"
          size="sm"
          className="w-full text-sm"
          onClick={() => {
            setCommentModalOpen(true);
          }}
        >
          {userCommentStatus?.is_completed ? "완료!" : "댓글 작성하기"}
        </Button>
      }
    />
  );
};
