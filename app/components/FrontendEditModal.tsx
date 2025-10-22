"use client";
import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { CandidatePatchData } from "../types/candidate";
import Modal from "./Modal";
import { useModal } from "../modalContext";
import Navbar from "./Navbar";
import axios from "axios";

interface FrontendEditModalProps {
  candidate?: CandidatePatchData | null;
  onClose?: () => void;
  onSave?: (data: CandidatePatchData) => void;
}

export default function FrontendEditModal({
  candidate,
  onSave,
}: FrontendEditModalProps) {
  const { currentModal, closeModal } = useModal();

  const initialFrontendFormData: CandidatePatchData = {
    fr_self_introduction: "",
    fr_project_explanation: "",
    fr_communication: "",
    html_css_theory: "",
    html_coding_easy: "",
    html_coding_medium: "",
    html_coding_hard: "",
    html_coding_overall_rating: 0,
    javascript_theory: "",
    javascript_coding_easy: "",
    javascript_coding_medium: "",
    javascript_coding_hard: "",
    javascript_overall_rating: 0,
    react_theory: "",
    react_coding_easy: "",
    react_coding_medium: "",
    react_coding_hard: "",
    react_overall_rating: 0,
    frontend_feedback: "",
    fr_meeting_recording: "",
  };

  const [formData, setFormData] = useState<CandidatePatchData>(
    initialFrontendFormData
  );
  const [originalData, setOriginalData] = useState<CandidatePatchData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        fr_self_introduction: candidate.fr_self_introduction || "",
        fr_project_explanation: candidate.fr_project_explanation || "",
        fr_communication: candidate.fr_communication || "",
        html_css_theory: candidate.html_css_theory || "",
        html_coding_easy: candidate.html_coding_easy || "",
        html_coding_medium: candidate.html_coding_medium || "",
        html_coding_hard: candidate.html_coding_hard || "",
        javascript_theory: candidate.javascript_theory || "",
        javascript_coding_easy: candidate.javascript_coding_easy || "",
        javascript_coding_medium: candidate.javascript_coding_medium || "",
        javascript_coding_hard: candidate.javascript_coding_hard || "",
        react_theory: candidate.react_theory || "",
        react_coding_easy: candidate.react_coding_easy || "",
        react_coding_medium: candidate.react_coding_medium || "",
        react_coding_hard: candidate.react_coding_hard || "",
        frontend_feedback: candidate.frontend_feedback || "",
        fr_meeting_recording: candidate.fr_meeting_recording || "",
      });
      setOriginalData(candidate);
    } else {
      setFormData(initialFrontendFormData);
      setOriginalData(null);
    }
    setMessage("");
  }, [candidate]);

  const handleInputChange = (
    field: keyof CandidatePatchData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getNum = (val: string | number | undefined) =>
    typeof val === "string" && val.length > 0 && !isNaN(Number(val[0]))
      ? Number(val[0])
      : 0;

  // 🧠 AI Refinement Handler
  const handleAiSubmit = async (e: React.MouseEvent) => {
    e.preventDefault(); // avoid form submit
    if (!(formData.frontend_feedback ?? '').trim()) return;

    setAiLoading(true);
    setError(null);

    try {
      const resp = await axios.post("/api/enhance", {
        text: formData.frontend_feedback,
      });

      const data = resp.data;
      handleInputChange("frontend_feedback", data.enhanced);
    } catch (e) {
      console.error(e);
      setError("Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };

  // 📝 Save Form Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate?.user_id) {
      setMessage("User ID missing.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const changedFields: Partial<CandidatePatchData> = {};
      (Object.keys(formData) as Array<keyof CandidatePatchData>).forEach(
        (key) => {
          if (formData[key] !== originalData?.[key]) {
            (changedFields as Record<string, string | number | undefined>)[
              key
            ] = formData[key];
          }
        }
      );

      const htmlAvg =
        Math.round(
          ((getNum(formData.html_css_theory) +
            getNum(formData.html_coding_easy) +
            getNum(formData.html_coding_medium) +
            getNum(formData.html_coding_hard)) /
            4) *
            10
        ) / 10;

      const jsAvg =
        Math.round(
          ((getNum(formData.javascript_theory) +
            getNum(formData.javascript_coding_easy) +
            getNum(formData.javascript_coding_medium) +
            getNum(formData.javascript_coding_hard)) /
            4) *
            10
        ) / 10;

      const reactAvg =
        Math.round(
          ((getNum(formData.react_theory) +
            getNum(formData.react_coding_easy) +
            getNum(formData.react_coding_medium) +
            getNum(formData.react_coding_hard)) /
            4) *
            10
        ) / 10;

      changedFields.html_coding_overall_rating = htmlAvg;
      changedFields.javascript_overall_rating = jsAvg;
      changedFields.react_overall_rating = reactAvg;

      let strongSkills = "";
      if (htmlAvg >= 4) strongSkills += "HTML, CSS";
      if (jsAvg >= 4) strongSkills += (strongSkills ? ", " : "") + "JS";
      if (reactAvg >= 4) strongSkills += (strongSkills ? ", " : "") + "React";

      const payload = { ...changedFields, strongest_skill: strongSkills };

      if (Object.keys(changedFields).length === 0) {
        setMessage("No changes detected.");
        setLoading(false);
        return;
      }

      const res = await axios.patch(
        `/api/addStudent/${candidate.user_id}`,
        payload
      );

      if (res.status === 200) {
        setMessage("Changes saved successfully!");
        onSave?.(res.data.updated);
        setTimeout(() => closeModal(), 1200);
      } else {
        setMessage("Failed to update candidate details.");
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
      setMessage("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const isOpen = currentModal === "frontend" && !!candidate;
  if (!isOpen) return null;

  const selectOptions = [
    "1. Lacks basic details and context",
    "2. Basic introduction with limited details.",
    "3. Clear introduction with minimal details.",
    "4. Includes relevant details and provides a good overview",
    "5. Well-organized, engaging, and detailed introduction.",
  ];

  const renderSelect = (label: string, field: keyof CandidatePatchData) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={formData[field] || ""}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
      >
        <option value="">Select rating...</option>
        {selectOptions.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="fixed inset-0 bg-opacity-50 bg-black/40 flex items-center justify-center p-4 z-50">
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

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Non Technical */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">
                Non-Technical
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSelect("Self Introduction", "fr_self_introduction")}
                {renderSelect("Project Explanation", "fr_project_explanation")}
                {renderSelect("Communication", "fr_communication")}
              </div>
            </div>

            {/* Technical */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">
                Technical
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSelect("HTML & CSS Theory", "html_css_theory")}
                {renderSelect("HTML & CSS Easy", "html_coding_easy")}
                {renderSelect("HTML & CSS Medium", "html_coding_medium")}
                {renderSelect("HTML & CSS Hard", "html_coding_hard")}
                {renderSelect("JavaScript Theory", "javascript_theory")}
                {renderSelect("JavaScript Easy", "javascript_coding_easy")}
                {renderSelect("JavaScript Medium", "javascript_coding_medium")}
                {renderSelect("JavaScript Hard", "javascript_coding_hard")}
                {renderSelect("React Theory", "react_theory")}
                {renderSelect("React Easy", "react_coding_easy")}
                {renderSelect("React Medium", "react_coding_medium")}
                {renderSelect("React Hard", "react_coding_hard")}
              </div>
            </div>

            {/* Feedback & AI */}
            <div className="w-full flex gap-4">
              {/* Left Section */}
              <div className="w-1/2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frontend Final Feedback
                </label>
                <textarea
                  value={formData.frontend_feedback || ""}
                  onChange={(e) =>
                    handleInputChange("frontend_feedback", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Enter feedback"
                />
                <button
                  type="button"
                  onClick={handleAiSubmit}
                  disabled={aiLoading}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                >
                  {aiLoading ? "Refining..." : "AI ✨"}
                </button>
              </div>

              {/* Right Section */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frontend Meeting Link
                </label>
                <textarea
                  value={formData.fr_meeting_recording || ""}
                  onChange={(e) =>
                    handleInputChange("fr_meeting_recording", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Enter meeting link"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.includes("success")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                disabled={loading}
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

