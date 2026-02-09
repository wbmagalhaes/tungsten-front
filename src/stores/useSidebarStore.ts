import { isDesktop } from '@utils/isDesktop';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarData {
  width: number;
  isOpen: boolean;
}

interface SidebarState extends SidebarData {
  setWidth: (w: number) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: isDesktop(),
      width: 230,
      setWidth: (w: number) => set({ width: w }),
      toggle: () =>
        set((s) => ({
          isOpen: isDesktop() ? true : !s.isOpen,
        })),
      open: () =>
        set({
          isOpen: true,
        }),
      close: () =>
        set({
          isOpen: isDesktop() ? true : false,
        }),
    }),
    {
      name: 'sidebar-preference',
      partialize: (state) =>
        isDesktop() ? { isOpen: state.isOpen, width: state.width } : {},
    },
  ),
);
