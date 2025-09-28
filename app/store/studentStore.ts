import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Candidate } from "../types/candidate"; // Assuming this is correct

interface StudentState {
  // Corrected: Single Candidate OR null
  student: Candidate | null; 
  // Corrected: setStudent accepts a single Candidate
  setStudent: (student: Candidate) => void; 
  clearStudent: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      // Corrected: Initialize with null, matching the interface
      student: null, 
      // Corrected: setStudent accepts and sets a single Candidate object
      setStudent: (student) => set({ student }),
      clearStudent: () => set({ student: null }),
    }),
    { name: "student-storage" }
  )
);