/**
 * 출석 시간(분)을 기반으로 색상 반환
 */
export const getAttendanceColor = (durationMinutes: number): string => {
  if (durationMinutes >= 120) return "#8B7355"; // 2시간 이상 - 진한 브라운
  if (durationMinutes >= 60) return "#A67C52"; // 1시간 이상 - 중간 브라운
  if (durationMinutes >= 30) return "#D4A574"; // 30분 이상 - 연한 브라운
  return "#E6B887"; // 30분 미만 - 가장 연한 브라운
};

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
export const formatDateForKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

/**
 * 시간(분)을 시간:분 형태로 포맷팅
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);

  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${remainingMinutes}분`;
};

/**
 * 출석률 계산
 */
export const calculateAttendanceRate = (
  attendanceDays: number,
  totalDays: number
): number => {
  if (totalDays === 0) return 0;
  return Math.round((attendanceDays / totalDays) * 100);
};

export const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

   // 첫 주의 시작 요일 (일요일 = 0)
   const startDay = firstDay.getDay();

   // 달력에 표시할 날짜들 생성
   const days = [];
 
   // 이전 달의 마지막 날들
   for (let i = startDay - 1; i >= 0; i--) {
     const date = new Date(year, month, -i);
     days.push({ date, isCurrentMonth: false });
   }
 
   // 이번 달 날짜들
   for (let i = 1; i <= lastDay.getDate(); i++) {
     const date = new Date(year, month, i);
     days.push({ date, isCurrentMonth: true });
   }
 
   // 다음 달 첫 날들 (6주 완성을 위해)
   const remainingDays = 42 - days.length;
   for (let i = 1; i <= remainingDays; i++) {
     const date = new Date(year, month + 1, i);
     days.push({ date, isCurrentMonth: false });
   }

   return days;
}
