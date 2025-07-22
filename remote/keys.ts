// remote/keys.ts
import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

const usersQueryKeys = createQueryKeys("users", {
  current: () => ["current"],
  information: (userId) => [userId],
});

const periodQueryKeys = createQueryKeys("period", {
  current: (year, month) => [year, month],
});

const checklistQueryKeys = createQueryKeys("checklist", {
  blogPost: (periodId) => [periodId],
  attendance: (periodId) => [periodId],
  comments: (commentId) => [commentId],
});

const attendanceQueryKeys = createQueryKeys("attendance", {
  list: (periodId) => [periodId],
});

const calendarQueryKeys = createQueryKeys("calendar", {
  periodAttendance: (periodId, userId) => [periodId, userId],
  dailyAttendance: (date, userId) => [date, userId],
  monthlyAttendance: (year, month, userId) => [year, month, userId],
  teamAttendance: (periodId) => ["team", periodId],
  userStats: (periodId, userId) => ["stats", periodId, userId],
  attendanceDays: (periodId, userId) => ["days", periodId, userId],
});

const memberQueryKeys = createQueryKeys("members", {
  progress: (periodId) => ["progress", periodId],
  onlineStatus: () => ["online-status"],
  summary: (periodId) => ["summary", periodId],
  teamStats: (periodId) => ["team-stats", periodId],
});

export const queryKeys = mergeQueryKeys(
  usersQueryKeys,
  periodQueryKeys,
  checklistQueryKeys,
  attendanceQueryKeys,
  calendarQueryKeys,
  memberQueryKeys,
);