"use client";
import React from "react";
import { useModal } from "../modalContext";

export default function Navbar() {
  const { openModal, currentModal } = useModal();

  const getButtonClasses = (modal: "candidate" | "frontend" | "backend") => {
    const baseClasses =
      "transition-all duration-100 ease-in-out font-medium px-4 py-2 rounded-sm";
    const activeClasses = "opacity-100";
    const inactiveClasses = "opacity-70 hover:opacity-100";

    let colorClasses = "";

    switch (modal) {
      case "candidate":
        colorClasses =
          currentModal === "candidate"
            ? "bg-white"
            : "bg-none";
        break;
      case "frontend":
        colorClasses =
          currentModal === "frontend"
            ? "bg-white"
            : "bg-none";
        break;
      case "backend":
        colorClasses =
          currentModal === "backend"
            ? "bg-white"
            : "bg-none";
        break;
    }

    return `${baseClasses} ${colorClasses} ${
      currentModal === modal ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav className=" flex gap-4 items-center bg-zinc-400/25 p-1 rounded">
      <button
        onClick={() => openModal("candidate")}
        className={`${getButtonClasses("candidate")} cursor-pointer`}
      >
        Candidate Overview
      </button>

      <button
        onClick={() => openModal("frontend")}
        className={`${getButtonClasses("frontend")} cursor-pointer`}
      >
        Frontend Edit
      </button>

      <button
        onClick={() => openModal("backend")}
        className={`${getButtonClasses("backend")} cursor-pointer`}
      >
        Backend Edit
      </button>
    </nav>
  );
}
