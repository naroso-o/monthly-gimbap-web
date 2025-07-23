export function DashboardCalendarLegends() {
  return (
    <div className="flex items-center gap-2 text-xs text-diary-muted">
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: "var(--calendar-no-attendance)",
          }}
        />
        <span>미접속</span>
      </div>
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: "var(--calendar-less-than-30-minutes)",
          }}
        />
        <span>30분미만</span>
      </div>
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: "var(--calendar-more-than-2-hours)",
          }}
        />
        <span>2시간이상</span>
      </div>
    </div>
  );
}
