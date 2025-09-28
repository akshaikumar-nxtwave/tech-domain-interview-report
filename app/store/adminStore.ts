import { create } from "zustand";
import { persist } from "zustand/middleware";
// 1. Import the Candidate type
import { Candidate } from "../types/candidate"; // Adjust the path as necessary

// 2. Define the AdminState interface using Candidate[]
interface AdminState {
    // The admin state will hold an array of Candidate objects
    admin: Candidate[];
    // setAdmin accepts an array of Candidate objects
    setAdmin: (admin: Candidate[]) => void;
    clearAdmin: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            // Initialize with an empty array of Candidate objects
            admin: [],
            // Set the state with the provided array
            setAdmin: (admin) => set({ admin }),
            clearAdmin: () => set({ admin: [] }),
        }),
        {
            name: "admin-storage",
        }
    )
);