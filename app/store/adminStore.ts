import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Candidate } from "../types/candidate";

interface AdminState {
    admin: Candidate[];
    setAdmin: (admin: Candidate[]) => void;
    clearAdmin: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            admin: [],
            setAdmin: (admin) => set({ admin }),
            clearAdmin: () => set({ admin: [] }),
        }),
        {
            name: "admin-storage",
        }
    )
);