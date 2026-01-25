import { isDesktop } from '@utils/isDesktop';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarData {
  isOpen: boolean;
}

interface SidebarState extends SidebarData {
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: isDesktop(),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'sidebar-preference',
      partialize: (state) => (isDesktop() ? { isOpen: state.isOpen } : {}),
    },
  ),
);
