"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  useCalendarAttendanceQuery,
  CalendarAttendanceData,
} from "@/remote/calendar";
import {
  formatDateForKey,
  formatDuration,
  getAttendanceColor,
  getCalendarDays,
} from "@/utils/calendar";
import { DashboardCalendarLegends } from "./calendar/DashboardCalendarLegends";
import { DashboardCalendarSummary } from "./calendar/DashboardCalendarSummary";

const MONTH_NAMES = [
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

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export function DashboardCalendar({ periodId }: { periodId: string }) {
  const [currentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const {
    data: attendanceData,
    isLoading,
    error,
  } = useCalendarAttendanceQuery(periodId);

  const days = getCalendarDays(year, month);

  // 실제 출석 데이터 또는 빈 객체
  const actualAttendanceData: CalendarAttendanceData =
    attendanceData?.attendance_data || {};

  // 로딩 중일 때
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex items-center justify-center">
          <div className="text-diary-muted">출석 데이터를 불러오는 중...</div>
        </CardContent>
      </Card>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex items-center justify-center">
          <div className="text-red-600 text-sm">
            출석 데이터를 불러오는데 실패했습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-diary-text">
            {year}년 {MONTH_NAMES[month]}
          </h3>
          <DashboardCalendarLegends />
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((day) => (
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
            const dateKey = formatDateForKey(day.date);
            const attendanceInfo = actualAttendanceData[dateKey];
            const isToday =
              day.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className="aspect-square flex items-center justify-center relative"
                title={
                  attendanceInfo?.attended
                    ? `${formatDuration(attendanceInfo.duration)} 접속${
                        attendanceInfo.first_record
                          ? ` (${new Date(
                              attendanceInfo.first_record
                            ).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} 체크인)`
                          : ""
                      }`
                    : day.isCurrentMonth
                    ? "출석 없음"
                    : ""
                }
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
                    className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full"
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
        <DashboardCalendarSummary
          totalAttendanceDays={attendanceData?.total_attendance_days || 0}
          avgMinutes={attendanceData?.avg_minutes || 0}
        />
      </CardContent>
    </Card>
  );
}
