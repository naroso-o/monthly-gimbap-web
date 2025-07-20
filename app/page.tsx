import { Metadata } from "next";
import { Header } from "../components/Header";
import { DashboardHeader } from "../components/DashboardHeader";
import { createQueryClient } from "../utils/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { prefetchUser } from "@/remote/users/server-queries";
import { prefetchPeriod } from "../remote/period/server-queries";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default async function HomePage() {
  const queryClient = createQueryClient();

  try {
    await prefetchUser(queryClient);
    await prefetchPeriod(queryClient);
  } catch (error) {
    console.error("Failed to prefetch user data:", error);
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-diary-bg">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="relative z-10 p-4 max-w-md mx-auto lg:max-w-4xl">
            <DashboardHeader />
            {/* <Dashboard />  */}
          </div>
        </HydrationBoundary>
      </div>
    </div>
  );
}
