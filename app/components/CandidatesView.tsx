"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  ExternalLink,
  CircleX,
} from "lucide-react";
import { Candidate } from "../types/candidate";

interface PerformanceModalProps {
  candidate?: Candidate | null;
  onClose?: () => void;
}

export default function PerformanceModal({
  candidate,
  onClose,
}: PerformanceModalProps) {
  const [currentView, setCurrentView] = useState<
    "overview" | "frontend" | "backend"
  >("overview");

  const frontendSkills = [
    {
      name: "HTML & CSS Theory",
      score: candidate?.html_css_theory,
      rating: candidate?.html_coding_overall_rating,
    },
    { name: "HTML Coding Easy", score: candidate?.html_coding_easy },
    { name: "HTML Coding Medium", score: candidate?.html_coding_medium },
    { name: "HTML Coding Hard", score: candidate?.html_coding_hard },
    { name: "JavaScript Theory", score: candidate?.javascript_theory },
    { name: "JavaScript Easy", score: candidate?.javascript_coding_easy },
    { name: "JavaScript Medium", score: candidate?.javascript_coding_medium },
    { name: "JavaScript Hard", score: candidate?.javascript_coding_hard },
    { name: "React Theory", score: candidate?.react_theory },
    { name: "React Easy", score: candidate?.react_coding_easy },
    { name: "React Medium", score: candidate?.react_coding_medium },
    { name: "React Hard", score: candidate?.react_coding_hard },
  ];

  const backendSkills = [
    { name: "Python Theory", score: candidate?.python_theory },
    { name: "Python Easy", score: candidate?.python_coding_easy },
    { name: "Python Medium", score: candidate?.python_coding_medium },
    { name: "Python Hard", score: candidate?.python_coding_hard },
    { name: "Node Theory", score: candidate?.node_theory },
    { name: "Node Easy", score: candidate?.node_coding_easy },
    { name: "Node Medium", score: candidate?.node_coding_medium },
    { name: "Node Hard", score: candidate?.node_coding_hard },
    { name: "SQL Theory", score: candidate?.sql_theory },
    { name: "SQL Easy", score: candidate?.sql_coding_easy },
    { name: "SQL Medium", score: candidate?.sql_coding_medium },
    { name: "SQL Hard", score: candidate?.sql_coding_hard },
  ];

  const overallRatings = [
    {
      name: "HTML Overall",
      score: candidate?.html_coding_overall_rating,
      color: "bg-blue-500",
    },
    {
      name: "JavaScript Overall",
      score: candidate?.javascript_overall_rating,
      color: "bg-yellow-500",
    },
    {
      name: "React Overall",
      score: candidate?.react_overall_rating,
      color: "bg-cyan-500",
    },
    {
      name: "Python Overall",
      score: candidate?.python_overall_rating,
      color: "bg-green-500",
    },
    {
      name: "Node Overall",
      score: candidate?.node_overall_rating,
      color: "bg-emerald-500",
    },
    {
      name: "SQL Overall",
      score: candidate?.sql_overall_rating,
      color: "bg-purple-500",
    },
  ];

  const getScoreColor = (score: string | number | null | undefined) => {
    if (score === null || score === undefined || score === "") return "text-gray-400 bg-gray-50";
    const numScore = typeof score === "number" ? score : parseFloat(String(score));
    if (isNaN(numScore)) return "text-gray-600 bg-gray-50";
    if (numScore >= 4.5) return "text-green-600 bg-green-50";
    if (numScore >= 4) return "text-blue-600 bg-blue-50";
    if (numScore >= 3 && numScore <= 4) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  function getScoreWidth(score: string | undefined) {
    if (!score) return "w-0";
    const skillPercentage: Record<string, string> = {
      "1": "w-1/5",
      "2": "w-2/5",
      "3": "w-3/5",
      "4": "w-4/5",
      "5": "w-full",
    };
    const key = String(score)[0];
    return skillPercentage[key] ?? "w-0";
  }

  const nonTechScore = (fs: number, fp: number, fc: number): number => {
    const rating = Math.round(((fs + fp + fc) / 4) * 10) / 10;
    return rating;
  };
  
  type Skill = {
    name: string;
    score?: string | number | null;
    rating?: string | number | null;
  };

  const renderSkillSection = (skills: Skill[], title: string) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
      {skills.map((skill: Skill, index) => {
        const scoreStr = skill.score != null ? String(skill.score) : "";
        const hasScore = scoreStr !== "";
        const scoreDigit = scoreStr ? Number(scoreStr[0]) : 0;
        const description = scoreStr ? scoreStr.slice(3) : "";

        return hasScore ? (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {skill.name || "NA"}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
                  scoreStr
                )}`}
              >
                {`${scoreDigit}/5`}
              </span>
            </div>

            <div className="text-sm bg-white p-2 rounded border">
              {description || "NA"}
            </div>
          </div>
        ) : (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {skill.name}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
                  skill.score
                )}`}
              >
                0
              </span>
            </div>

            <div className="text-sm text-gray-600 bg-white p-2 rounded border">
              {"NA"}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {candidate?.candidate_name}
                </h2>
                <p className="text-blue-100 flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-2" />
                  {candidate?.mobile_number}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 cursor-pointer"
            >
              <CircleX className="w-8 h-8" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-6 bg-white/20 bg-opacity-10 rounded-lg p-1">
            <button
              onClick={() => setCurrentView("overview")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentView === "overview"
                  ? "bg-white text-blue-600"
                  : "text-white hover:bg-white/20 hover:bg-opacity-20"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView("frontend")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentView === "frontend"
                  ? "bg-white text-blue-600"
                  : "text-white hover:bg-white/20 hover:bg-opacity-20"
              }`}
            >
              Frontend Skills
            </button>
            <button
              onClick={() => setCurrentView("backend")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentView === "backend"
                  ? "bg-white text-blue-600"
                  : "text-white hover:bg-white/20 hover:bg-opacity-20"
              }`}
            >
              Backend Skills
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentView === "overview" && (
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </p>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {candidate?.candidate_email}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Interview Status
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      candidate?.interview_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : candidate?.interview_status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : candidate?.interview_status === "Rescheduled"
                        ? "bg-purple-100 text-purple-800"
                        : candidate?.interview_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {candidate?.interview_status}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Non-Tech Score
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {nonTechScore(
                      (candidate?.fr_self_introduction &&
                        Number(candidate?.fr_self_introduction[0])) ||
                        0,
                      (candidate?.fr_project_explanation &&
                        Number(candidate?.fr_project_explanation[0])) ||
                        0,
                      (candidate?.fr_communication &&
                        Number(candidate?.fr_communication[0])) ||
                        0
                    )}
                  </p>
                </div>
              </div>

              {/* Overall Ratings */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Overall Technical Ratings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overallRatings.map(
                    (rating) =>
                      rating.score && (
                        <div
                          key={rating.name}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium text-gray-700`}>
                              {rating.name}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {rating.score}/5
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${getScoreWidth(Math.round(Number(rating.score)).toString())} duration-500 bg-${
                                getScoreColor(rating.score).split(' ')[1].split('-')[1]
                              }-500`}
                            />
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Interview Feedback */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Frontend Feedback
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {candidate?.frontend_feedback || "No frontend feedback"}
                  </p>
                </div>
              
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Backend Feedback
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {candidate?.backend_feedback || "No backend feedback"}
                  </p>
                </div>
              

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    Strongest Skills
                  </h4>
                  <p className="text-green-700">
                   {candidate?.strongest_skill || "No strong skills"}
                  </p>
                </div>

                {candidate?.placement_status && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Placement Status
                    </h4>
                    <p className="text-blue-700">
                      {candidate.placement_status === 'Nxtwave' ? `${candidate.placement_status}: ${candidate.company}` : `${candidate.placement_status}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "frontend" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Frontend Skills Assessment
                </h3>
                <div className="text-sm text-gray-500">
                  Interview Date:{" "}
                  {candidate?.frontend_interview_date?.split('T')[0] || "Not scheduled"}
                </div>
              </div>
              <span className="text-lg font-semibold text-gray-900 py-2">
                Non Tech Score
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="flex flex-col rounded-xl p-4 bg-zinc-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      Self Introduction
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getScoreColor(
                        candidate?.fr_self_introduction
                      )}`}
                    >
                      {`${candidate?.fr_self_introduction?.[0] || 0}/5`}
                    </span>
                  </div>

                  <div className="font-normal text-sm text-gray-700 bg-white border border-zinc-200 rounded-lg p-3 min-h-[50px]">
                    {candidate?.fr_self_introduction?.slice(3) ||
                      "No feedback available."}
                  </div>
                </div>

                <div className="flex flex-col rounded-xl p-4 bg-zinc-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      Project Explanation
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getScoreColor(
                        candidate?.fr_project_explanation
                      )}`}
                    >
                      {`${candidate?.fr_project_explanation?.[0] || 0}/5`}
                    </span>
                  </div>

                  <div className="font-normal text-sm text-gray-700 bg-white border border-zinc-200 rounded-lg p-3 min-h-[50px]">
                    {candidate?.fr_project_explanation?.slice(3) ||
                      "No feedback available."}
                  </div>
                </div>

                <div className="flex flex-col rounded-xl p-4 bg-zinc-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      Communication
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getScoreColor(
                        candidate?.fr_communication
                      )}`}
                    >
                      {`${candidate?.fr_communication?.[0] || 0}/5`}
                    </span>
                  </div>

                  <div className="font-normal text-sm text-gray-700 bg-white border border-zinc-200 rounded-lg p-3 min-h-[50px]">
                    {candidate?.fr_communication?.slice(3) ||
                      "No feedback available."}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {renderSkillSection(
                    frontendSkills.filter((skill) =>
                      skill.name.includes("HTML")
                    ),
                    "HTML & CSS Skills"
                  )}
                </div>
                <div>
                  {renderSkillSection(
                    frontendSkills.filter((skill) =>
                      skill.name.includes("JavaScript")
                    ),
                    "JavaScript Skills"
                  ) ?? "NA"}
                </div>
              </div>

              <div>
                {renderSkillSection(
                  frontendSkills.filter((skill) =>
                    skill.name.includes("React")
                  ),
                  "React Skills"
                )}
              </div>
            </div>
          )}

          {currentView === "backend" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Backend Skills Assessment
                </h3>
                <div className="text-sm text-gray-500">
                  Interview Date:{" "}
                  {candidate?.backend_interview_date?.split('T')[0] || "Not scheduled"}
                </div>
              </div>

              <span className="text-lg font-semibold text-gray-900 py-2">
                Non Tech Score
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="flex flex-col rounded-xl p-4 bg-zinc-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      Self Introduction
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getScoreColor(
                        candidate?.be_self_introduction
                      )}`}
                    >
                      {`${candidate?.be_self_introduction?.[0]|| 0}/5`}
                    </span>
                  </div>

                  <div className="font-normal text-sm text-gray-700 bg-zinc-50 border border-zinc-200 rounded-lg p-3 min-h-[50px]">
                    {candidate?.be_self_introduction?.slice(3) ||
                      "No feedback available."}
                  </div>
                </div>

                <div className="flex flex-col rounded-xl p-4 bg-zinc-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      Project Explanation
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getScoreColor(
                        candidate?.be_project_explanation
                      )}`}
                    >
                      {`${candidate?.be_project_explanation?.[0] || 0}/5`}
                    </span>
                  </div>

                  <div className="font-normal text-sm text-gray-700 bg-zinc-50 border border-zinc-200 rounded-lg p-3 min-h-[50px]">
                    {candidate?.be_project_explanation?.slice(3) ||
                      "No feedback available."}
                  </div>
                </div>

                <div className="flex flex-col rounded-xl p-4 bg-zinc-100/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">
                      Communication
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getScoreColor(
                        candidate?.be_communication
                      )}`}
                    >
                      {`${candidate?.be_communication?.[0] || 0}/5`}
                    </span>
                  </div>

                  <div className="font-normal text-sm text-gray-700 bg-zinc-50 border border-zinc-200 rounded-lg p-3 min-h-[50px]">
                    {candidate?.be_communication?.slice(3) ||
                      "No feedback available."}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  {renderSkillSection(
                    backendSkills.filter((skill) =>
                      skill.name.includes("Python")
                    ),
                    "Python Skills"
                  )}
                </div>
                <div>
                  {renderSkillSection(
                    backendSkills.filter((skill) =>
                      skill.name.includes("Node")
                    ),
                    "Node.js Skills"
                  )}
                </div>
              </div>

              <div>
                {renderSkillSection(
                  backendSkills.filter((skill) => skill.name.includes("SQL")),
                  "Database/SQL Skills"
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            {candidate?.candidate_resume_link && (
              <a
                href={candidate?.candidate_resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Resume
              </a>
            )}
            {candidate?.meeting_link && (
              <a
                href={candidate?.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-200 rounded-md hover:bg-green-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Meeting
              </a>
            )}
            {candidate?.fr_meeting_recording && (
              <a
                href={candidate?.fr_meeting_recording}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-200 rounded-md hover:bg-green-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Frontend Meeting
              </a>
            )}
            {candidate?.be_meeting_recording && (
              <a
                href={candidate?.be_meeting_recording}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-200 rounded-md hover:bg-green-50"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Backend Meeting
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
