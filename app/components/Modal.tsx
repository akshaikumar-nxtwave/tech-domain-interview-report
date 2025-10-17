"use client";
import { CircleX } from "lucide-react";
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <CircleX/>
        </button>
        {children}
      </div>
    </div>
  );
}
