"use client";
import { useCurrentPeriodQuery } from "../remote/period";
import { Dashboard } from "./Dashboard";
import { DashboardHeader } from "./DashboardHeader";

export const DashboardSection = () => {
  const { data: currentPeriod } = useCurrentPeriodQuery();

  return (
    <div className="min-h-screen bg-diary-bg">
      <div className="relative z-10 p-4 max-w-md mx-auto lg:max-w-4xl">
        <DashboardHeader />
        <Dashboard periodId={currentPeriod?.id || ""} />
      </div>
    </div>
  );
};
