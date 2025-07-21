"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Play, Square } from "lucide-react";
import { useModalStore } from "@/stores/useModalStore";
import {
  useAttendanceMutation,
  useDailyAttendanceSummaryQuery,
  useAttendanceStatusQuery,
} from "@/remote/attendance";
import { useCurrentPeriodQuery } from "@/remote/period";

export const AttendanceModal = () => {
  const now = new Date();
  // 원본 ISO 날짜 문자열 그대로 사용 (시간대 변환 제거)
  const today = now.toISOString().split("T")[0];

  const { data: dailyAttendanceSummary } =
    useDailyAttendanceSummaryQuery(today);
  const { data: attendanceStatus } = useAttendanceStatusQuery(today);
  const { data: period } = useCurrentPeriodQuery();
  const { mutate: submitAttendance } = useAttendanceMutation();

  const { attendanceModalOpen, setAttendanceModalOpen } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 현재 상태 결정
  const getCurrentState = () => {
    switch (attendanceStatus) {
      case "start":
        return {
          type: "first" as const,
          buttonText: "시작",
          icon: <Play className="w-4 h-4" />,
          statusText: "시작 전",
          isActive: false,
        };
      case "end":
        return {
          type: "end" as const,
          buttonText: "종료",
          icon: <Square className="w-4 h-4" />,
          statusText: "활동 중",
          isActive: true,
        };
      case "restart":
        return {
          type: "restart" as const,
          buttonText: "다시 시작하기",
          icon: <Play className="w-4 h-4" />,
          statusText: "휴식 중",
          isActive: false,
        };
      default:
        return {
          type: "first" as const,
          buttonText: "시작",
          icon: <Play className="w-4 h-4" />,
          statusText: "시작 전",
          isActive: false,
        };
    }
  };

  const handleSubmit = async () => {
    if (!period?.id) {
      console.error("Period not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const state = getCurrentState();
      const actionType =
        state.type === "first" || state.type === "restart" ? "start" : "end";

      await submitAttendance({
        periodId: period.id,
        type: actionType,
      });

      setAttendanceModalOpen(false);
    } catch (err) {
      console.error("출석 기록 중 오류:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAttendanceModalOpen(false);
  };

  const currentState = getCurrentState();

  return (
    <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
      <DialogContent className="max-w-md bg-white">
        <DialogClose onClick={handleClose} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-diary-muted" />
            출석 기록
          </DialogTitle>
          <DialogDescription>
            오늘의 스터디 활동을 기록해보세요.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-6">
          {/* 현재 상태 표시 */}
          <div className="text-center p-4 bg-diary-border/10 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {currentState.icon}
              <span className="font-medium text-diary-text">
                {currentState.statusText}
              </span>
              {currentState.isActive && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <p className="text-xs text-diary-muted">
              현재 시간: {currentTime.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Asia/Seoul",
              })}
            </p>
            <p className="text-xs text-diary-muted">
              익일 6시에 자동 초기화됩니다.
            </p>
          </div>

          {/* 오늘의 기록 */}
          {dailyAttendanceSummary?.sessions &&
            dailyAttendanceSummary.sessions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-diary-text">
                  오늘의 기록
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {dailyAttendanceSummary.sessions.map((record, index) => (
                    <div
                      key={`${record.time}-${index}`}
                      className="flex items-center justify-between text-xs p-2 bg-diary-border/5 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {record.type === "시작" ? (
                          <Play className="w-3 h-3 text-green-600" />
                        ) : (
                          <Square className="w-3 h-3 text-red-600" />
                        )}
                        <span className="text-diary-text">{record.type}</span>
                      </div>
                      <span className="text-diary-muted">
                        {new Date(record.time).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Seoul",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || !period?.id}
            >
              <div className="flex items-center gap-2">
                {currentState.icon}
                {isSubmitting ? "기록 중..." : currentState.buttonText}
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
