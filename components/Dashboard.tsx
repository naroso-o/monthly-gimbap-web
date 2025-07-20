"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageCircle,
  PenTool,
  Users,
  Sparkles,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { ChecklistData } from "../types";
import { useEffect, useState } from "react";
import { useUserQuery } from "../remote/users";

export function Dashboard() {
  // const completedCount = [
  //   checklistData.blogPost.isCompleted,
  //   checklistData.attendance.isCompleted,
  //   checklistData.comments.isCompleted,
  // ].filter(Boolean).length;

  return (
    <>
      {/* 체크리스트 요약 */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-stone-300 bg-white mb-4">
          <span className="text-2xl font-light text-stone-600">
            {completedCount}/3
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          이번 달 완료한 체크리스트
        </p>
      </div>

      {/* 체크리스트 카드들 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 블로그 글 작성 */}
        <DashboardCard
          title="블로그 글쓰기"
          icon={<PenTool className="w-5 h-5 text-stone-600" />}
          description="이번 달 블로그 글 1개 작성하기"
          isCompleted={checklistData.blogPost.isCompleted}
          button={
            <Button variant="primary" size="sm" className="w-full text-sm">
              {checklistData.blogPost.isCompleted ? "완료!" : "글 작성 체크"}
            </Button>
          }
        />

        <DashboardCard
          title="수요일 출석"
          icon={<Calendar className="w-5 h-5 text-stone-600" />}
          description={`월 2회 이상 수요일 출석 (${checklistData.attendance.wednesdayCount}/2)`}
          isCompleted={checklistData.attendance.isCompleted}
          button={
            <Button variant="primary" size="sm" className="w-full text-sm">
              {checklistData.attendance.isCompleted ? "완료!" : "출석 기록하기"}
            </Button>
          }
        />

        <DashboardCard
          title="댓글 활동"
          icon={<MessageCircle className="w-5 h-5 text-stone-600" />}
          description={`월 4명 이상에게 댓글 달기 (${checklistData.comments.completedCount}/4)`}
          isCompleted={checklistData.comments.isCompleted}
          button={
            <Button variant="primary" size="sm" className="w-full text-sm">
              {checklistData.comments.isCompleted ? "완료!" : "댓글 작성하기"}
            </Button>
          }
        />
      </div>

      {/* 이번 달 활동 요약 */}
      <Card className="bg-white border border-stone-200 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-stone-700 text-base">
            <Sparkles className="w-4 h-4 text-amber-600" />
            이번 달 활동
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">총 출석</span>
              <Badge
                variant="outline"
                className="text-xs border-stone-300 text-stone-600"
              >
                {checklistData.attendance.totalAttendanceCount}회
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">수요일 출석</span>
              <Badge
                variant="outline"
                className="text-xs border-stone-300 text-stone-600"
              >
                {checklistData.attendance.wednesdayCount}회
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-600">댓글 활동</span>
              <Badge
                variant="outline"
                className="text-xs border-stone-300 text-stone-600"
              >
                {checklistData.comments.completedCount}명
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-stone-700"></div>
              <span className="text-xs text-stone-600">홈</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Calendar className="w-5 h-5 text-stone-400" />
              <span className="text-xs text-stone-400">출석</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <MessageCircle className="w-5 h-5 text-stone-400" />
              <span className="text-xs text-stone-400">댓글</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Users className="w-5 h-5 text-stone-400" />
              <span className="text-xs text-stone-400">멤버</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
