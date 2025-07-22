import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { DashboardSection } from "../components/dashboard/DashboardSection";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default function HomePage() {
  return (
    <div className="pb-[var(--bottom-menu-height)]">
      <Header />
      <DashboardSection />
      {/* TODO */}
      {/* <BottomNavigation /> */} 
    </div>
  );
}
