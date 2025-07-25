"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { usePeriodStore } from "@/stores/usePeriodStore";
import { useCurrentPeriodQuery } from "@/remote/period";

export const Header = () => {
  const { setPeriod } = usePeriodStore();
  const { data: currentPeriod } = useCurrentPeriodQuery();
  
  useEffect(() => {
    if (currentPeriod) {
      setPeriod({...currentPeriod, month: currentPeriod.month - 1});
    }
  }, [currentPeriod, setPeriod]);

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
