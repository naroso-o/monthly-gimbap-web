import { Metadata } from "next";
import HomeLayout from "@/components/HomeLayout";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "코드 김밥",
  description: "코드 김밥 블로그 스터디 모임",
};

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .single();

  // 현재 월 정보 가져오기
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: currentPeriod } = await supabase
    .from("monthly_periods")
    .select("*")
    .eq("year", currentYear)
    .eq("month", currentMonth)
    .single();

  return (
    <HomeLayout user={user} currentPeriod={currentPeriod} />
  );
}
