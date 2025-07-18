"use client";
import { auth } from "../utils/supabase/authService";
import { Button } from "./ui/button";

export const Header = () => {
  const handleSignOut = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-16 px-4 py-2">
      <div className="flex justify-end items-center">
        <Button onClick={handleSignOut} variant="secondary">
          Sign Out
        </Button>
      </div>
    </div>
  );
};
