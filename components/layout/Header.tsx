"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { usePeriodStore } from "@/stores/usePeriodStore";
import { usePeriodIdQuery } from "@/remote/period";

export const Header = () => {
  const { setPeriod, setPreviousId } = usePeriodStore();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const nowBeforeMonth = new Date(now.setMonth(now.getMonth() - 1));
  const prevYear = nowBeforeMonth.getFullYear();
  const prevMonth = nowBeforeMonth.getMonth() + 1;

  const { data: currentPeriod } = usePeriodIdQuery(year, month);
  const { data: previousPeriod } = usePeriodIdQuery(prevYear, prevMonth);

  useEffect(() => {
    if (currentPeriod) {
      setPeriod({ ...currentPeriod, month: currentPeriod.month - 1 });
    }
  }, [currentPeriod, setPeriod]);

  useEffect(() => {
    if (previousPeriod) {
      setPreviousId(previousPeriod.id);
    }
  }, [previousPeriod, setPreviousId]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-end items-center p-4">
        <Button onClick={handleSignOut} variant="secondary">
          Sign Out
        </Button>
      </div>
    </div>
  );
};
