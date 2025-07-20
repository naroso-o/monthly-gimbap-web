import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

const usersQueryKeys = createQueryKeys("users", {
  information: () => ["information"],
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

export const queryKeys = mergeQueryKeys(
  usersQueryKeys,
  periodQueryKeys,
  checklistQueryKeys,
  attendanceQueryKeys,
);
