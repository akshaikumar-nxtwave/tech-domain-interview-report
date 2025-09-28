'use client'
import React from 'react';
import { User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStudentStore } from '../store/studentStore';



export default function StudentReport() {
  const  student  = useStudentStore((state) => state.student)
  const router = useRouter();
    
    if (!student || (Array.isArray(student) && student.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No student data available
      </div>
    );
  }


  function loginPage() {
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-6 flex items-center px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          onClick={loginPage}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student?.candidate_name || 'N/A'}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-2" />
                  {student?.mobile_number || 'N/A'}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {student?.candidate_email || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Non-Tech Score</h3>
            <div className="text-3xl font-bold text-blue-600">{student?.final_non_tech_score || 'N/A'}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Self Introduction</h3>
            <div className="text-sm text-gray-600 line-clamp-3">{student?.self_introduction || 'N/A'}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication</h3>
            <div className="text-sm text-gray-600 line-clamp-3">{student?.communication || 'N/A'}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Strongest Skill</h3>
            <div className="text-sm font-medium text-green-600">{student?.strongest_skill || 'N/A'}</div>
          </div>
        </div>

        {/* Skills Assessment */}
        

        {/* Feedback Section */}
        
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interviewer Feedback</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">{student.final_feedback || 'N/A'}</p>
            </div>
          </div>
      </div>
    </div>
  );
}






