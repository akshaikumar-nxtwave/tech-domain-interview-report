"use client";
import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import axios from "axios";

import { Candidate, CandidatePatchData } from "../types/candidate";
import Modal from "./Modal";
import { useModal } from "../modalContext";
import Navbar from "./Navbar";
import Calendar24 from "../../components/DateAndTime";
import DropdownMenuRadioGroupDemo from "app/components/Dropdown";
import PlacedDropDown from "app/components/PlacedDropDown";

interface CandidateEditModalProps {
  candidate?: CandidatePatchData | null;
  onClose?: () => void;
  onSave?: (data: CandidatePatchData) => void;
}

const initialFormData: CandidatePatchData = {
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
  interview_status: "Scheduled",
  meeting_link: "",
  company: ""
};

export default function CandidateEditModal({ candidate }: CandidateEditModalProps) {
  const { currentModal, closeModal } = useModal();

  const [formData, setFormData] = useState<Candidate>(initialFormData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<CandidatePatchData | null>(null);

  const [frontendDate, setFrontendDate] = useState<Date | undefined>();
  const [frontendTime, setFrontendTime] = useState("10:00");
  const [backendDate, setBackendDate] = useState<Date | undefined>();
  const [backendTime, setBackendTime] = useState("10:00");

  const parseDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const datePart = dateString.split("T")[0];
    const date = new Date(datePart);
    return isNaN(date.getTime()) ? undefined : date;
  };

  useEffect(() => {
    if (candidate) {
      setFormData({
        user_id: candidate.user_id || "",
        candidate_name: candidate.candidate_name || "",
        mobile_number: candidate.mobile_number || "",
        candidate_email: candidate.candidate_email || "",
        candidate_resume_link: candidate.candidate_resume_link || "",
        placement_status: candidate.placement_status || "Pending",
        frontend_interview_date: candidate.frontend_interview_date || "",
        frontend_time_slot: candidate.frontend_time_slot || "",
        backend_interview_date: candidate.backend_interview_date || "",
        backend_time_slot: candidate.backend_time_slot || "",
        interview_status: candidate.interview_status || "Scheduled",
        meeting_link: candidate.meeting_link || "",
        company: candidate.company || ""
      });

      setOriginalData(candidate);
      setFrontendDate(parseDate(candidate.frontend_interview_date));
      setFrontendTime(candidate.frontend_time_slot || "10:00");
      setBackendDate(parseDate(candidate.backend_interview_date));
      setBackendTime(candidate.backend_time_slot || "10:00");
    } else {
      setFormData(initialFormData);
      setOriginalData(initialFormData);
    }
  }, [candidate]);

  const handleInputChange = (field: keyof Candidate, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id) {
      setMessage("User ID is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      
      
      const diff: Partial<CandidatePatchData> = {};
      if (originalData) {
              (Object.keys(formData) as Array<keyof CandidatePatchData>).forEach((key) => {
                if (formData[key] !== originalData?.[key]) {
                  (diff as Record<string, string | number | undefined>)[key] = formData[key];
                }
              });
      }

      if (Object.keys(diff).length === 0) {
        setMessage("No changes detected.");
        setLoading(false);
        return;
      }

      const res = await axios.patch(`/api/addStudent/${formData.user_id}`, diff);

      if (res.status === 200) {
        setMessage("Candidate details updated successfully!");
        
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        setMessage("Failed to update candidate details.");
      }
    } catch (err) {
      console.error("Error updating candidate:", err);
      setMessage("An error occurred while updating candidate details.");
    } finally {
      setLoading(false);
    }
  };

  const isOpen = currentModal === "candidate" && !!candidate;
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <Navbar />
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-400 cursor-pointer"
            >
              <CircleX className="w-6 h-6" />
            </button>
          </div>


          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">UID *</label>
                <input
                  required
                  type="text"
                  value={formData.user_id}
                  onChange={(e) => handleInputChange("user_id", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  required
                  type="text"
                  value={formData.candidate_name}
                  onChange={(e) => handleInputChange("candidate_name", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile *</label>
                <input
                  required
                  type="tel"
                  value={formData.mobile_number}
                  onChange={(e) => handleInputChange("mobile_number", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  required
                  type="email"
                  value={formData.candidate_email}
                  onChange={(e) => handleInputChange("candidate_email", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Resume Link</label>
                <input
                  type="url"
                  value={formData.candidate_resume_link}
                  onChange={(e) => handleInputChange("candidate_resume_link", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placement Status</label>
                  <PlacedDropDown
                    value={formData.placement_status ?? "Pending"}
                    onChange={(val) => handleInputChange("placement_status", val)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
              <div className="flex gap-2">
                <div className="pr-4">
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

                <div className="pr-4">
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
              </div>

              <div className="flex gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Interview Status *
                  </label>
                  <DropdownMenuRadioGroupDemo
                    value={formData.interview_status ?? "Pending"}
                    onChange={(val) => handleInputChange("interview_status", val)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meeting Link
              </label>
              <input
                type="url"
                value={formData.meeting_link}
                onChange={(e) => handleInputChange("meeting_link", e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {message && (
              <div className="p-2 bg-green-100 text-green-800 rounded-md">
                {message}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
