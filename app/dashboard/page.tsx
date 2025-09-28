'use client'
import { Calendar, Download, Eye, Filter, LogOut, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CandidateAddModal from "../components/CandidateAddModal";
import { useAdminStore } from "../store/adminStore";
import axios from "axios";
import { CandidatePatchData } from "../types/candidate";

export default function Dashboard(){
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
    const { setAdmin } = useAdminStore();
    const admin = useAdminStore((state) => state.admin) as CandidatePatchData[];
    
    async function fetchAdminData() {
    const res = await axios.get("/api/students");
        setAdmin(res.data)
        console.table(res.data);
        console.table(admin);
    }
    useEffect(() => {
      fetchAdminData();
    }, [setAdmin]);

  function onLogout(){
    router.push("/")
  }

  const openModal = () => {
    setIsModalOpen(true);
  }

  // const handleAddClick = () => {
  //   setEditingCandidate(null);
  //   setIsModalOpen(true);
  // };
  

  // const [ setStatusFilter] = useState<String>('all')
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage candidate interviews and assessments</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                //   value={searchTerm}
                //   onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  // value={statusFilter}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                //   value={dateType}
                //   onChange={(e) => setDateType(e.target.value as 'frontend' | 'backend' | 'final')}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="frontend">Frontend Date</option>
                  <option value="backend">Backend Date</option>
                  <option value="final">Final Date</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="date"
                //   value={dateFilter}
                //   onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Filter by date"
                />
              </div>
            </div>
            <button
        onClick={openModal}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Candidate
      </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {candidates.filter(c => c.interviewStatus === 'Scheduled').length} */}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {candidates.filter(c => c.interviewStatus === 'Completed').length} */}
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
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {/* {candidates.length > 0 ? Math.round((candidates.filter(c => c.placementStatus).length / candidates.length) * 100) : 0}% */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frontend</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backend</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admin.map((i: CandidatePatchData) => (
                  <tr key={i.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{i.candidate_name ?? "NA"}</div>
                        <div className="text-sm text-gray-500">{i.user_id ?? "NA"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{i.mobile_number ?? "NA"}</div>
                      <div className="text-sm text-gray-500">{i.candidate_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(i.frontend_interview_date)?.split('T')[0]}</div>
                      <div className="text-sm text-gray-500">{i.frontend_time_slot ?? "NA"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(i.frontend_interview_date)?.split('T')[0]}</div>
                      <div className="text-sm text-gray-500">{i.frontend_time_slot ?? "NA"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}>
                        {i.interview_status ?? "NA"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}>
                        {i.interview_duration ?? "NA"}
                      </span>
                    </td>
                    
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewClick(candidate)}
                        className="text-green-600 hover:text-green-900 mr-4"
                        title="View Performance"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(candidate)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        title="Edit Candidate"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFrontendEditClick(candidate)}
                        className="text-purple-600 hover:text-purple-900 mr-2"
                        title="Edit Frontend Assessment"
                      >
                        <span className="text-xs font-medium">FE</span>
                      </button>
                      <button
                        onClick={() => handleBackendEditClick(candidate)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Edit Backend Assessment"
                      >
                        <span className="text-xs font-medium">BE</span>
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No candidates found</div>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )} */}
      </div>

      {/* {isModalOpen && (
        <CandidateEditModal
          candidate={editingCandidate}
          onClose={handleModalClose}
          onSave={handleSaveCandidate}
        />
      )}

      {viewingCandidate && (
        <PerformanceModal
          candidate={viewingCandidate}
          onClose={handlePerformanceModalClose}
        />
      )}

      {frontendEditCandidate && (
        <FrontendEditModal
          candidate={frontendEditCandidate}
          onClose={handleFrontendEditClose}
          onSave={handleFrontendSave}
        />
      )}

      {backendEditCandidate && (
        <BackendEditModal
          candidate={backendEditCandidate}
          onClose={handleBackendEditClose}
          onSave={handleBackendSave}
        />
      )} */}
      {isModalOpen && (<CandidateAddModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>)}
    </div>
  );
}