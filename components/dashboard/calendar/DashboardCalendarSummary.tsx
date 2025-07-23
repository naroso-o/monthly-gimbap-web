import { formatDuration } from "@/utils/calendar";

export function DashboardCalendarSummary({
  totalAttendanceDays,
  avgMinutes,
}: {
  totalAttendanceDays: number;
  avgMinutes: number;
}) {
  return (
    <div className="mt-4 pt-3 border-t border-diary-border">
      <div className="flex justify-between text-xs">
        <span className="text-diary-muted">이번 달 출석</span>
        <span className="text-diary-text font-medium">
          {totalAttendanceDays}일
        </span>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-diary-muted">평균 접속 시간</span>
        <span className="text-diary-text font-medium">
          {formatDuration(avgMinutes)}
        </span>
      </div>
    </div>
  );
}
