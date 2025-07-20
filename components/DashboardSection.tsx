"use client";
import { useCurrentPeriodQuery } from "../remote/period";
import { Dashboard } from "./Dashboard";
import { DashboardCalendar } from "./DashboardCalendar";
import { DashboardHeader } from "./DashboardHeader";

export const DashboardSection = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { data: currentPeriod } = useCurrentPeriodQuery(year, month);

  return (
    <div className="min-h-screen bg-diary-bg">
      <div className="relative z-10 p-4 max-w-md mx-auto lg:max-w-4xl">
        <DashboardHeader />
        <Dashboard periodId={currentPeriod?.id || ""} />
        <DashboardCalendar periodId={currentPeriod?.id || ""} />
      </div>
    </div>
  );
};
