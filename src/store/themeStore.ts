import { create } from 'zustand'

export const themeStore = create((set) => ({
  get: 0,
  set: () => set({ get: 0 }),
}))
