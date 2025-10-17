"use client";
import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { CandidatePatchData } from "../types/candidate";
import Modal from "./Modal";
import { useModal } from "../modalContext";
import Navbar from "./Navbar";
import axios from "axios";

const initialBackendFormData: CandidatePatchData = {
  be_self_introduction: "",
  be_project_explanation: "",
  be_communication: "",
  python_theory: "",
  python_coding_easy: "",
  python_coding_medium: "",
  python_coding_hard: "",
  python_overall_rating: 0,
  node_theory: "",
  node_coding_easy: "",
  node_coding_medium: "",
  node_coding_hard: "",
  node_overall_rating: 0,
  sql_theory: "",
  sql_coding_easy: "",
  sql_coding_medium: "",
  sql_coding_hard: "",
  sql_overall_rating: 0,
  backend_feedback: "",
  be_meeting_recording: "",
};

interface BackendEditModalProps {
  candidate?: CandidatePatchData | null;
  onClose?: () => void;
  onSave?: (data: CandidatePatchData) => void;
}

export default function BackendEditModal({
  candidate,
  onSave,
}: BackendEditModalProps) {
  const { currentModal, closeModal } = useModal();
  const [formData, setFormData] = useState<CandidatePatchData>(
    initialBackendFormData
  );
  const [originalData, setOriginalData] = useState<CandidatePatchData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isOpen = currentModal === "backend" && !!candidate;

  useEffect(() => {
    if (candidate) {
      setFormData({
        be_self_introduction: candidate.be_self_introduction || "",
        be_project_explanation: candidate.be_project_explanation || "",
        be_communication: candidate.be_communication || "",
        python_theory: candidate.python_theory || "",
        python_coding_easy: candidate.python_coding_easy || "",
        python_coding_medium: candidate.python_coding_medium || "",
        python_coding_hard: candidate.python_coding_hard || "",
        python_overall_rating: candidate.python_overall_rating || 0,
        node_theory: candidate.node_theory || "",
        node_coding_easy: candidate.node_coding_easy || "",
        node_coding_medium: candidate.node_coding_medium || "",
        node_coding_hard: candidate.node_coding_hard || "",
        node_overall_rating: candidate.node_overall_rating || 0,
        sql_theory: candidate.sql_theory || "",
        sql_coding_easy: candidate.sql_coding_easy || "",
        sql_coding_medium: candidate.sql_coding_medium || "",
        sql_coding_hard: candidate.sql_coding_hard || "",
        sql_overall_rating: candidate.sql_overall_rating || 0,
        backend_feedback: candidate.backend_feedback || "",
        be_meeting_recording: candidate.be_meeting_recording || "",
      });
      setOriginalData(candidate);
    } else {
      setFormData(initialBackendFormData);
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

  // ✅ Helper to extract numeric rating
  const getNum = (val: string | number | undefined) =>
    typeof val === "string" && val.length > 0 && !isNaN(Number(val[0]))
      ? Number(val[0])
      : 0;

  // ✅ AI refinement for backend feedback
  const handleAiSubmit = async () => {
    if (!(formData.backend_feedback ?? "").trim()) return;

    setAiLoading(true);
    setError(null);

    try {
      const resp = await axios.post("/api/enhance", {
        text: formData.backend_feedback,
      });

      const data = resp.data;
      handleInputChange("backend_feedback", data.refined);
    } catch (e) {
      console.error(e);
      
      setError("Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };

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

      // ✅ Calculate ratings
      const pythonAvg =
        Math.round(
          ((getNum(formData.python_theory) +
            getNum(formData.python_coding_easy) +
            getNum(formData.python_coding_medium) +
            getNum(formData.python_coding_hard)) /
            4) *
            10
        ) / 10;

      const nodeAvg =
        Math.round(
          ((getNum(formData.node_theory) +
            getNum(formData.node_coding_easy) +
            getNum(formData.node_coding_medium) +
            getNum(formData.node_coding_hard)) /
            4) *
            10
        ) / 10;

      const sqlAvg =
        Math.round(
          ((getNum(formData.sql_theory) +
            getNum(formData.sql_coding_easy) +
            getNum(formData.sql_coding_medium) +
            getNum(formData.sql_coding_hard)) /
            4) *
            10
        ) / 10;

      changedFields.python_overall_rating = pythonAvg;
      changedFields.node_overall_rating = nodeAvg;
      changedFields.sql_overall_rating = sqlAvg;

      let strongSkills = "";
      if (pythonAvg >= 4) strongSkills += "Python";
      if (nodeAvg >= 4) strongSkills += (strongSkills ? ", " : "") + "Node";
      if (sqlAvg >= 4) strongSkills += (strongSkills ? ", " : "") + "SQL";

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

  if (!isOpen) return null;

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
            {/* Non-Technical */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">
                Non-Technical
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSelect("Self Introduction", "be_self_introduction")}
                {renderSelect("Project Explanation", "be_project_explanation")}
                {renderSelect("Communication", "be_communication")}
              </div>
            </div>

            {/* Technical */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">
                Technical
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSelect("Python Theory", "python_theory")}
                {renderSelect("Python Easy", "python_coding_easy")}
                {renderSelect("Python Medium", "python_coding_medium")}
                {renderSelect("Python Hard", "python_coding_hard")}
                {renderSelect("Node Theory", "node_theory")}
                {renderSelect("Node Easy", "node_coding_easy")}
                {renderSelect("Node Medium", "node_coding_medium")}
                {renderSelect("Node Hard", "node_coding_hard")}
                {renderSelect("SQL Theory", "sql_theory")}
                {renderSelect("SQL Easy", "sql_coding_easy")}
                {renderSelect("SQL Medium", "sql_coding_medium")}
                {renderSelect("SQL Hard", "sql_coding_hard")}
              </div>
            </div>

            {/* Feedback + AI */}
            <div className="w-full flex gap-6">
              <div className="w-1/2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backend Final Feedback
                </label>
                <textarea
                  value={formData.backend_feedback || ""}
                  onChange={(e) =>
                    handleInputChange("backend_feedback", e.target.value)
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

              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backend Meeting Link
                </label>
                <textarea
                  value={formData.be_meeting_recording || ""}
                  onChange={(e) =>
                    handleInputChange("be_meeting_recording", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Enter additional comments"
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
