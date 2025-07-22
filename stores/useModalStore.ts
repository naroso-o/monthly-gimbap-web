import { create } from "zustand";

interface ModalState {
  postSubmitModalOpen: boolean;
  setPostSubmitModalOpen: (open: boolean) => void;

  attendanceModalOpen: boolean;
  setAttendanceModalOpen: (open: boolean) => void;

  commentModalOpen: boolean;
  setCommentModalOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  postSubmitModalOpen: false,
  setPostSubmitModalOpen: (open) => set({ postSubmitModalOpen: open }),

  attendanceModalOpen: false,
  setAttendanceModalOpen: (open) => set({ attendanceModalOpen: open }),

  commentModalOpen: false,
  setCommentModalOpen: (open) => set({ commentModalOpen: open }),
}));
