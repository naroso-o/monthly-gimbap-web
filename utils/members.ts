// utils/members.ts
import { MemberDashboardSummary } from "../remote/members";

/**
 * 완료율에 따른 색상 반환
 */
export const getCompletionColor = (rate: number): string => {
  if (rate === 100) return "var(--diary-accent)";
  if (rate >= 66) return "#A67C52";
  if (rate >= 33) return "#D4A574";
  return "var(--diary-muted)";
};

/**
 * 진행 상태에 따른 색상 반환
 */
export const getProgressStatusColor = (
  status: MemberDashboardSummary["progress_status"]
): string => {
  const colors = {
    completed: "var(--diary-accent)",
    good: "#A67C52",
    fair: "#D4A574",
    poor: "var(--diary-muted)",
  };
  return colors[status] || colors.poor;
};

/**
 * 마지막 활동 시간을 상대적 시간으로 포맷팅
 */
export const formatLastActivity = (lastActivity: string): string => {
  const now = new Date();
  const activityTime = new Date(lastActivity);
  const diffMs = now.getTime() - activityTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return "1일 전";
  if (diffDays < 7) return `${diffDays}일 전`;

  return activityTime.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
};

/**
 * 멤버 상태 요약 텍스트 생성
 */
export const getMemberStatusText = (member: MemberDashboardSummary): string => {
  const tasks = [];
  
  if (member.blog_completed) tasks.push("블로그");
  if (member.comments_completed) tasks.push("댓글");
  if (member.attendance_completed) tasks.push("출석");

  if (tasks.length === 0) return "아직 시작하지 않음";
  if (tasks.length === 3) return "모든 작업 완료!";
  
  return `${tasks.join(", ")} 완료`;
};

/**
 * 분 단위 시간을 기반으로 온라인 상태 판단
 */
export const isUserOnline = (minutesSinceLastActivity: number): boolean => {
  return minutesSinceLastActivity <= 30; // 30분 이내면 온라인
};

/**
 * 완료율 계산
 */
export const calculateCompletionRate = (completedTasks: number, totalTasks: number): number => {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

/**
 * 팀 성과 등급 계산
 */
export const getTeamPerformanceGrade = (avgCompletionRate: number): string => {
  if (avgCompletionRate >= 90) return "A+";
  if (avgCompletionRate >= 80) return "A";
  if (avgCompletionRate >= 70) return "B+";
  if (avgCompletionRate >= 60) return "B";
  if (avgCompletionRate >= 50) return "C+";
  if (avgCompletionRate >= 40) return "C";
  return "D";
};

/**
 * 작업별 완료 상태 아이콘 반환
 */
export const getTaskStatusIcon = (completed: boolean): "✅" | "⭕" => {
  return completed ? "✅" : "⭕";
};

/**
 * 완료율에 따른 상태 메시지 반환
 */
export const getCompletionStatusMessage = (rate: number): string => {
  if (rate === 100) return "완벽해요! 🎉";
  if (rate >= 80) return "거의 다 했어요! 💪";
  if (rate >= 60) return "절반 이상 완료! 👍";
  if (rate >= 30) return "조금 더 화이팅! 🔥";
  return "시작해볼까요? 🚀";
};

/**
 * 멤버의 상세 진행 상황 텍스트 생성
 */
export const getMemberDetailedProgress = (member: MemberDashboardSummary): string => {
  const details = [];
  
  // 블로그 상태
  if (member.blog_completed) {
    details.push("✅ 블로그 작성 완료");
  } else {
    details.push("⭕ 블로그 작성 필요");
  }
  
  // 댓글 상태
  if (member.comments_completed) {
    details.push(`✅ 댓글 ${member.comments_made}개 작성 완료`);
  } else {
    details.push(`⭕ 댓글 ${member.comments_made}/2개 (${2 - member.comments_made}개 더 필요)`);
  }
  
  // 출석 상태
  if (member.attendance_completed) {
    details.push(`✅ 출석 ${member.attendance_days}일 완료`);
  } else {
    details.push(`⭕ 출석 ${member.attendance_days}/4일 (${4 - member.attendance_days}일 더 필요)`);
  }
  
  return details.join("\n");
};