import { Calendar } from "lucide-react";
import { useAttendanceCheckQuery } from "@/remote/attendance";
import { ChecklistCard } from "./ChecklistCard";
import { Button } from "../../ui/button";
import { useModalStore } from "@/stores/useModalStore";
import { usePeriodStore } from "../../../stores/usePeriodStore";

export const AttendanceCard = () => {
  const { setAttendanceModalOpen } = useModalStore();
  const { period } = usePeriodStore();
  const { data: attendanceChecklist } = useAttendanceCheckQuery(period?.id || "");

  return (
    <ChecklistCard
      title="출석"
      icon={<Calendar className="w-5 h-5 text-stone-600" />}
      description={`월 2회 이상 수요일 정기모임 출석 (${
        attendanceChecklist?.wednesday_count || 0
      }/2)`}
      isCompleted={attendanceChecklist?.is_completed || false}
      button={
        <Button
          variant="primary"
          size="sm"
          className="w-full text-sm"
          onClick={() => setAttendanceModalOpen(true)}
        >
          {attendanceChecklist?.is_completed ? "완료!" : "출석 기록하기"}
        </Button>
      }
    />
  );
};
