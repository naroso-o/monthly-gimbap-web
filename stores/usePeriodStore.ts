import { create } from "zustand";

interface Period {
  id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
}

interface PeriodState {
  period: Period | null;
  setPeriod: (period: Period | null) => void;

  previousId: string | null;
  setPreviousId: (previousId: string | null) => void;
}

export const usePeriodStore = create<PeriodState>((set) => ({
  period: null,
  setPeriod: (period: Period | null) => set({ period }),

  previousId: null,
  setPreviousId: (previousId) => set({ previousId }),
}));
