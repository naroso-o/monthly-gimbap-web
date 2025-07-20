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

export const queryKeys = mergeQueryKeys(usersQueryKeys, periodQueryKeys);
