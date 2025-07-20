import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Dashboard } from "@/components/Dashboard";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-diary-bg">
        <div className="relative z-10 p-4 max-w-md mx-auto lg:max-w-4xl">
          <DashboardHeader />
          <Dashboard /> 
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
