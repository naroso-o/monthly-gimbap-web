import { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "../components/Header";
import { auth } from "../utils/supabase/authService";
import { DashboardHeader } from "../components/DashboardHeader";
import { User } from "@/types";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default async function HomePage() {
  const { data, error } = await auth.getUser();
  const user = data as User | null;

  return (
    <div>
      <Header />

      <div
        className="min-h-screen bg-stone-50"
        style={{ backgroundColor: "#F7F5F3" }}
      >
        <div className="relative z-10 p-4 max-w-md mx-auto lg:max-w-4xl">
          <DashboardHeader user={user} />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
