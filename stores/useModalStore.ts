import { create } from "zustand";

interface ModalState {
  postSubmitModalOpen: boolean;
  setPostSubmitModalOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  postSubmitModalOpen: false,
  setPostSubmitModalOpen: (open) => set({ postSubmitModalOpen: open }),
}));
