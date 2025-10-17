"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "candidate" | "frontend" | "backend" | null;

type ModalContextType = {
  currentModal: ModalType;
  openModal: (modal: Exclude<ModalType, null>) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);

  const openModal = (modal: Exclude<ModalType, null>) => setCurrentModal(modal);
  const closeModal = () => setCurrentModal(null);

  return (
    <ModalContext.Provider value={{ currentModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};
