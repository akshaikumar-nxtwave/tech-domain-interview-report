"use client";
import React from "react";
import { useModal } from "../modalContext";

export default function Navbar() {
  const { openModal, currentModal } = useModal();

  const getButtonClasses = (modal: "candidate" | "frontend" | "backend") => {
    const baseClasses =
      "transition-all duration-100 ease-in-out font-medium px-4 py-2 rounded-lg";
    const activeClasses = "";
    const inactiveClasses = "";

    let colorClasses = "";

    switch (modal) {
      case "candidate":
        colorClasses =
          currentModal === "candidate"
            ? "bg-white"
            : "transition-all duration-300 ease-in-out font-semibold text-sm px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg cursor-pointer flex-1 whitespace-nowrap text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 hover:text-white";
        break;
      case "frontend":
        colorClasses =
          currentModal === "frontend"
            ? "bg-white"
            : "transition-all duration-300 ease-in-out font-semibold text-sm px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg cursor-pointer flex-1 whitespace-nowrap text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 hover:text-white";
        break;
      case "backend":
        colorClasses =
          currentModal === "backend"
            ? "bg-white"
            : "transition-all duration-300 ease-in-out font-semibold text-sm px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg cursor-pointer flex-1 whitespace-nowrap text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 hover:text-white";
        break;
    }

    return `${baseClasses} ${colorClasses} ${
      currentModal === modal ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav className=" flex gap-4 items-center bg-zinc-900 p-2 rounded-xl">
      <button
        onClick={() => openModal("candidate")}
        className={`${getButtonClasses("candidate")} cursor-pointer`}
      >
        Candidate Edit
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
