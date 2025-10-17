"use client";
import {
  Calendar,
  Download,
  Eye,
  Filter,
  LogOut,
  Plus,
  Search,
  SquarePen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminStore } from "../store/adminStore";
import axios from "axios";
import { CandidatePatchData } from "../types/candidate";
import CandidateEditModal from "../components/CandidateEditModal";
import CandidateAddModal from "../components/CandidateAddModal";
import { useModal } from "../modalContext";
import FrontendEditModal from "../components/FrontendEditModal";
import BackendEditModal from "../components/BackendEditModal";
import CandidatesView from "../components/CandidatesView";

export default function Dashboard() {
  const { openModal } = useModal();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidatePatchData | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchSkill, setSearchSkill] = useState("")
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateType, setDateType] = useState<"frontend" | "backend">("frontend");
  const [dateFilter, setDateFilter] = useState("");

  const { setAdmin } = useAdminStore();
  const admin = useAdminStore((state) => state.admin) as CandidatePatchData[];

  const [filteredCandidates, setFilteredCandidates] = useState<
    CandidatePatchData[]
  >([]);

  async function fetchAdminData() {
    const res = await axios.get("/api/students");
    setAdmin(res.data);
    setFilteredCandidates(res.data);
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCandidates(admin);
      return;
    }

    const term = searchTerm.trim().toLowerCase();
    const terms = term
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        term
      );
    const isNumeric = /^[0-9, ]+$/.test(term);

    let filtered: CandidatePatchData[] = [];

    if (isUUID) {
      filtered = admin.filter((c) => c.user_id?.toLowerCase() === term);
    } else if (isNumeric) {
      filtered = admin.filter((c) => terms.includes(String(c.mobile_number)));
    } else {
      filtered = admin.filter((c) =>
        terms.some((t) => c.candidate_name?.toLowerCase().includes(t))
      );
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, admin]);

  // filter for skills
  // ✅ Filter by strongest_skill only
useEffect(() => {
  const term = searchSkill.trim().toLowerCase();

  // If no input, show all candidates
  if (!term) {
    setFilteredCandidates(admin);
    return;
  }

  // Split comma-separated input (e.g., "python, sql")
  const terms = term
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Filter candidates whose strongest_skill includes any of the search terms
  const filtered = admin.filter((candidate) => {
    const skills =
      candidate.strongest_skill?.toLowerCase().split(",").map((s) => s.trim()) ||
      [];

    return terms.some((t) => skills.includes(t));
  });

  setFilteredCandidates(filtered);
}, [searchSkill, admin]);



  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredCandidates(admin);
    } else {
      setFilteredCandidates(
        admin.filter((c) => c.placement_status === statusFilter)
      );
    }
  }, [statusFilter, admin]);

  useEffect(() => {
    if (!dateFilter) {
      setFilteredCandidates(admin);
      return;
    }

    const key =
      dateType === "frontend"
        ? "frontend_interview_date"
        : "backend_interview_date";

    const filtered = admin.filter((c) => {
  const rawDate = c[key as keyof typeof c];

  if (typeof rawDate !== "string") return false;

  const [recordDate] = rawDate.split("T");
  return recordDate === dateFilter;
});


    setFilteredCandidates(filtered);
  }, [dateFilter, dateType, admin]);

  function onLogout() {
    router.push("/");
  }

  const openModall = () => setIsModalOpen(true);
  const editModal = (candidateData: CandidatePatchData) => {
    setSelectedCandidate(candidateData);
    openModal("candidate");
  };
  const candidateViewModal = (candidateData: CandidatePatchData) => {
    setSelectedCandidate(candidateData);
    setViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tech Domain Interview Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter ID, number, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Skills"
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-40 sm:w-40"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 cursor-pointer pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="On-Campus">On-Campus</option>
                  <option value="External">External</option>
                  <option value="Nxtwave">Nxtwave</option>
                </select>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={dateType}
                  onChange={(e) =>
                    setDateType(e.target.value as "frontend" | "backend")
                  }
                  className="pl-10 pr-8 py-2 border cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="frontend">Frontend Date</option>
                  <option value="backend">Backend Date</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={openModall}
              className="bg-blue-600 text-white px-2 py-2 rounded-lg font-medium flex items-center cursor-pointer w-40"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Candidate
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Candidates
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {admin.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4 flex flex-col">
                <p className="text-sm font-medium text-gray-500">Placement Stats</p>
                <label className="text-sm font-medium">
                  Nxtwave:{" "}
                  {admin.filter((i) => i.placement_status === "Nxtwave").length}
                </label>
                <label className="text-sm font-medium">
                  External:{" "}
                  {
                    admin.filter((i) => i.placement_status === "External")
                      .length
                  }
                </label>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    admin.filter((i) => i.interview_status === "Completed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {admin.length === 0
                    ? 0
                    : Math.round(
                        (admin.filter((i) => i.placement_status === "Nxtwave")
                          .length /
                          admin.length) *
                          100
                      )}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-100 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Frontend
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Backend
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase">
                    Interview Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Company Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Strongest Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Placed Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium  uppercase ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((i) => (
                  <tr key={i.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-sm font-medium text-gray-900">
                        <div
                          className={`mt-2 mr-1 bg-${
                            (i.placement_status === "Nxtwave" && "blue") || (i.placement_status === "Pending" && "yellow")
                          }-500 w-2 h-2 rounded-full`}
                        ></div>
                        {i.candidate_name ?? "NA"}
                      </div>
                      <div className="ml-3 text-sm text-gray-500">
                        {i.user_id ?? "NA"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {i.mobile_number ?? "NA"}
                      <div className="text-gray-500">{i.candidate_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {i.frontend_interview_date?.split("T")[0] ?? "NA"}
                      <div className="text-gray-500">
                        {i.frontend_time_slot ?? "NA"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {i.backend_interview_date?.split("T")[0] ?? "NA"}
                      <div className="text-gray-500">
                        {i.backend_time_slot ?? "NA"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {i.interview_status ?? "NA"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {i.placement_status ?? "NA"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {i.strongest_skill || "No Strong Skills"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {i.company && i.company || "Pending"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-green-600 hover:text-green-900 mr-4 cursor-pointer"
                        onClick={() => editModal(i)}
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 cursor-pointer"
                        onClick={() => candidateViewModal(i)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCandidates.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      No candidates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && (
          <CandidateAddModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {viewModal && (
          <CandidatesView
            onClose={() => setViewModal(false)}
            candidate={selectedCandidate}
          />
        )}
        <CandidateEditModal candidate={selectedCandidate} />
        <FrontendEditModal candidate={selectedCandidate} />
        <BackendEditModal candidate={selectedCandidate} />
      </div>
    </div>
  );
}