"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";

interface AttendanceData {
  [key: string]: {
    attended: boolean;
    duration: number; // 분 단위
  };
}

// 더미 출석 데이터
const mockAttendanceData: AttendanceData = {
  "2025-07-03": { attended: true, duration: 45 },
  "2025-07-05": { attended: true, duration: 120 },
  "2025-07-10": { attended: true, duration: 30 },
  "2025-07-12": { attended: true, duration: 90 },
  "2025-07-15": { attended: true, duration: 60 },
  "2025-07-17": { attended: true, duration: 150 },
  "2025-07-20": { attended: true, duration: 75 },
  "2025-07-22": { attended: true, duration: 40 },
  "2025-07-24": { attended: true, duration: 110 },
};

export function DashboardCalendar({ periodId }: { periodId: string }) {
  const [currentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 이번 달 첫날과 마지막날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 첫 주의 시작 요일 (일요일 = 0)
  const startDay = firstDay.getDay();

  // 달력에 표시할 날짜들 생성
  const days = [];

  // 이전 달의 마지막 날들
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, isCurrentMonth: false });
  }

  // 이번 달 날짜들
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true });
  }

  // 다음 달 첫 날들 (6주 완성을 위해)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false });
  }

  const getAttendanceColor = (duration: number) => {
    if (duration >= 120) return "#8B7355"; // 2시간 이상 - 진한 브라운
    if (duration >= 60) return "#A67C52"; // 1시간 이상 - 중간 브라운
    if (duration >= 30) return "#D4A574"; // 30분 이상 - 연한 브라운
    return "#E6B887"; // 30분 미만 - 가장 연한 브라운
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-diary-text">
            {year}년 {monthNames[month]}
          </h3>
          <div className="flex items-center gap-2 text-xs text-diary-muted">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-diary-border"></div>
              <span>미접속</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#E6B887" }}
              ></div>
              <span>30분미만</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#8B7355" }}
              ></div>
              <span>2시간이상</span>
            </div>
          </div>
        </div>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div
              key={day}
              className="text-center text-xs text-diary-muted py-1"
            >
              {day}
            </div>
          ))}
        </div>
        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dateKey = formatDate(day.date);
            const attendanceInfo = mockAttendanceData[dateKey];
            const isToday =
              day.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className="aspect-square flex items-center justify-center relative"
              >
                <span
                  className={`text-xs ${
                    day.isCurrentMonth
                      ? isToday
                        ? "text-diary-text font-semibold"
                        : "text-diary-text"
                      : "text-diary-muted"
                  }`}
                >
                  {day.date.getDate()}
                </span>

                {/* 출석 표시 원 */}
                {day.isCurrentMonth && (
                  <div
                    className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: attendanceInfo?.attended
                        ? getAttendanceColor(attendanceInfo.duration)
                        : "var(--diary-border)",
                    }}
                  />
                )}

                {/* 오늘 표시 */}
                {isToday && (
                  <div className="absolute inset-0 border border-diary-accent rounded-full opacity-50" />
                )}
              </div>
            );
          })}
        </div>
        {/* 이번 달 출석 요약 */}
        <div className="mt-4 pt-3 border-t border-diary-border">
          <div className="flex justify-between text-xs">
            <span className="text-diary-muted">이번 달 출석</span>
            <span className="text-diary-text font-medium">
              {
                Object.keys(mockAttendanceData).filter((key) =>
                  key.startsWith(
                    `${year}-${String(month + 1).padStart(2, "0")}`
                  )
                ).length
              }
              일
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-diary-muted">평균 접속 시간</span>
            <span className="text-diary-text font-medium">
              {Math.round(
                Object.values(mockAttendanceData)
                  .filter((data) => data.attended)
                  .reduce((sum, data) => sum + data.duration, 0) /
                  Object.values(mockAttendanceData).filter(
                    (data) => data.attended
                  ).length
              )}
              분
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
