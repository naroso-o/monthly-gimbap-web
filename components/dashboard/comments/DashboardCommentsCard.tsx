import { MessageCircle } from "lucide-react";
import { DashboardCard } from "../DashboardCard";
import { useCommentsQuery } from "../../../remote/checklist";
import { useCommentsCheckQuery } from "../../../remote/checklist";
import { Button } from "../../ui/button";

export const DashboardCommentsCard = ({ periodId }: { periodId: string }) => {
  const { data: commentsCheck } = useCommentsCheckQuery(periodId);
  const { data: comments } = useCommentsQuery(commentsCheck?.id || "");

  return (
    <DashboardCard
      title="댓글 활동"
      icon={<MessageCircle className="w-5 h-5 text-stone-600" />}
      description={`월 4명 이상에게 댓글 달기 (${comments?.length || 0}/4)`}
      isCompleted={commentsCheck?.is_completed || false}
      button={
        <Button
          variant="primary"
          size="sm"
          className="w-full text-sm"
          onClick={() => {}}
        >
          {commentsCheck?.is_completed ? "완료!" : "댓글 작성하기"}
        </Button>
      }
    />
  );
};
