import { PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "../DashboardCard";
import { useModalStore } from "@/stores/useModalStore";
import { useBlogPostsQuery, useBlogPostCheckQuery } from "@/remote/blog";

export const DashboardPostCard = ({ periodId }: { periodId: string }) => {
  const { setPostSubmitModalOpen } = useModalStore();

  const { data: blogPostChecklist } = useBlogPostCheckQuery(periodId);
  const { data: blogPosts } = useBlogPostsQuery(periodId);

  return (
    <DashboardCard
      title="블로그 글쓰기"
      icon={<PenTool className="w-5 h-5 text-stone-600" />}
      description={`월 1개 이상 블로그 작성하기 (${blogPosts?.length || 0}/1)`}
      isCompleted={blogPostChecklist?.is_completed || false}
      button={
        <Button
          variant="primary"
          size="sm"
          className="w-full text-sm"
          onClick={() => setPostSubmitModalOpen(true)}
        >
          {blogPostChecklist?.is_completed ? "추가 글 등록하기" : "글 등록하기"}
        </Button>
      }
    />
  );
};
