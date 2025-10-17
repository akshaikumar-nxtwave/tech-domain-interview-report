import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Candidate } from "../types/candidate";

interface StudentState {
  student: Candidate | null;
  setStudent: (student: Candidate) => void; 
  clearStudent: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      student: null,
      setStudent: (student) => set({ student }),
      clearStudent: () => set({ student: null }),
    }),
    { name: "student-storage" }
  )
);
