import { create } from "zustand";
// import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
// import { immer } from "zustand/middleware/immer";

export interface Drawer {
    open: boolean
    setOpen: (state: boolean) => void
}

export const useDrawerStore = create<Drawer>((set) => ({
    open: false,
    setOpen: () => set((state) => {
        localStorage.setItem("menu_open", String(state.open))
        return { open: state.open }
    })
}))