"use client";

import React, { useState } from "react";
import { CircleX } from "lucide-react";
import { Candidate } from "../types/candidate";
import axios from "axios";
import Calendar24 from "../../components/DateAndTime";
import DropdownMenuRadioGroupDemo from "../../components/Dropdown";
import PlacedDropDown from "../../components/PlacedDropDown";

interface CandidateAddModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function CandidateAddModal({
  isModalOpen,
  setIsModalOpen,
}: CandidateAddModalProps) {
  const [formData, setFormData] = useState<Candidate>({
    user_id: "",
    candidate_name: "",
    mobile_number: "",
    candidate_email: "",
    candidate_resume_link: "",
    placement_status: "Pending",
    frontend_interview_date: "",
    frontend_time_slot: "",
    backend_interview_date: "",
    backend_time_slot: "",
    interview_status: "Pending",
    meeting_link: "",
  });

  const [frontendDate, setFrontendDate] = useState<Date | undefined>();
  const [frontendTime, setFrontendTime] = useState("10:00");
  const [backendDate, setBackendDate] = useState<Date | undefined>();
  const [backendTime, setBackendTime] = useState("10:00");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (field: keyof Candidate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        frontend_interview_date: frontendDate
          ? frontendDate.toISOString().split("T")[0]
          : null,
        frontend_time_slot: frontendTime,
        backend_interview_date: backendDate
          ? backendDate.toISOString().split("T")[0]
          : null,
        backend_time_slot: backendTime,
      };

      const response = await axios.post("/api/addStudent", payload);

      if (response.status === 201) {
        setMessage("Candidate created successfully!");
        setFormData({
          user_id: "",
          candidate_name: "",
          mobile_number: "",
          candidate_email: "",
          candidate_resume_link: "",
          placement_status: "Pending",
          frontend_interview_date: "",
          frontend_time_slot: "",
          backend_interview_date: "",
          backend_time_slot: "",
          interview_status: "Pending",
          meeting_link: "",
        });
        setFrontendDate(undefined);
        setBackendDate(undefined);
        setFrontendTime("10:00");
        setBackendTime("10:00");
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Server error");
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Candidate</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            <CircleX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>UID *</label>
              <input
                required
                type="text"
                value={formData.user_id}
                onChange={(e) => handleInputChange("user_id", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Name *</label>
              <input
                required
                type="text"
                value={formData.candidate_name}
                onChange={(e) =>
                  handleInputChange("candidate_name", e.target.value)
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Mobile *</label>
              <input
                required
                type="tel"
                value={formData.mobile_number}
                onChange={(e) =>
                  handleInputChange("mobile_number", e.target.value)
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Email *</label>
              <input
                required
                type="email"
                value={formData.candidate_email}
                onChange={(e) =>
                  handleInputChange("candidate_email", e.target.value)
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Resume Link</label>
              <input
                type="url"
                value={formData.candidate_resume_link}
                onChange={(e) =>
                  handleInputChange("candidate_resume_link", e.target.value)
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label>Placement through *</label>
              <PlacedDropDown
                value={formData.placement_status ?? "Pending"}
                onChange={(val) => handleInputChange("placement_status", val)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col md:flex-row divide-x-2 divide-gray-200">
              <div className="p-4 md:pr-6 md:pl-0 flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700">
                  Frontend Interview *
                </label>
                <Calendar24
                  date={frontendDate}
                  setDate={setFrontendDate}
                  time={frontendTime}
                  setTime={setFrontendTime}
                />
              </div>

              <div className="p-4 md:px-6 flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700">
                  Backend Interview *
                </label>
                <Calendar24
                  date={backendDate}
                  setDate={setBackendDate}
                  time={backendTime}
                  setTime={setBackendTime}
                />
              </div>

              <div className="p-4 md:pl-6 flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700">
                  Interview Status *
                </label>
                <DropdownMenuRadioGroupDemo
                  value={formData.interview_status ?? "Pending"}
                  onChange={(val) => handleInputChange("interview_status", val)}
                />
              </div>
            </div>

            <div className="hidden md:block"></div>
          </div>
          <div>
            <label>Meeting Link</label>
            <input
              type="url"
              value={formData.meeting_link}
              onChange={(e) =>
                handleInputChange("meeting_link", e.target.value)
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {message && (
            <div className="p-2 bg-green-100 text-green-800">{message}</div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
