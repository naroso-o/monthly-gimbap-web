"use client";

import { User } from "@/types";
import { GimbapIcon } from "./GimbapIcon";
import { useState } from "react";
import { clientAuth } from "@/utils/supabase/clientAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const DashboardHeader = ({ user }: { user: User | null }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");

  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    
    try {
      await clientAuth.updateUserMetadata({ name: tempName });
      setIsEditingName(false);
      window.location.reload(); // 간단한 새로고침
    } catch (error) {
      console.error("Name update failed:", error);
    }
  };

  return (
    <div className="mb-6 pt-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <GimbapIcon className="w-12 h-12" />
        </div>
        <h1
          className="text-xl font-medium text-stone-700"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {user ? (
            <>
              {isEditingName ? (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-32 text-center"
                  />
                  <Button size="sm" onClick={handleUpdateName}>
                    저장
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingName(false)}>
                    취소
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{user.name}님의 김밥일기</span>
                  {user.name === user.email?.split('@')[0] && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setIsEditingName(true)}
                      className="text-xs"
                    >
                      이름 설정
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            "게스트님의 김밥일기"
          )}
        </h1>
        {/* <p className="text-sm text-stone-500">{currentPeriod?.month}</p> */}
      </div>
    </div>
  );
};
