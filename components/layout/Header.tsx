"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export const Header = () => {
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
