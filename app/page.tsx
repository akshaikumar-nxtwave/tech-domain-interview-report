"use client";
import React, { useState } from "react";
import { Phone, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useStudentStore } from "./store/studentStore";

export default function LoginForm() {
  const [mobile, setMobile] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ADMIN_NUMBER = process.env.NEXT_PUBLIC_ADMIN_NUMBER;
  const router = useRouter();
  const { setStudent } = useStudentStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mobile.length == 36 && mobile === ADMIN_NUMBER) {
        router.push("/dashboard");
        return;
      }

      const res = await axios.post("/api/students", { mobile });

      if (res.status === 200) {
        console.log("Called at login page")
        setStudent(res.data);
        router.push("/report");
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { status?: number } }).response === "object" &&
        ((err as { response?: { status?: number } }).response?.status === 404)
      ) {
        setError("No record found for this mobile number.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">
            Enter your registered mobile number to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
