"use client";
import { auth } from "../utils/supabase/authService";
import { Button } from "./ui/button";

export const Header = () => {
  const handleSignOut = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className=" w-full h-16">
      <div className="flex justify-end items-center">
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </div>
  );
};
