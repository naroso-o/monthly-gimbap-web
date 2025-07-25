import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { DashboardSection } from "../components/dashboard/DashboardSection";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "../remote/keys";
import { createQueryClient } from "../utils/query-client";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default function HomePage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const queryClient = createQueryClient();
  queryClient.prefetchQuery(queryKeys.period.current(year, month));
  queryClient.prefetchQuery(queryKeys.users.current());
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="pb-[var(--bottom-menu-height)]">
      <HydrationBoundary state={dehydratedState}>
        <Header />
        <DashboardSection />
      </HydrationBoundary>
      {/* TODO */}
      {/* <BottomNavigation /> */}
    </div>
  );
}
