import { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default async function HomePage() {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
}
