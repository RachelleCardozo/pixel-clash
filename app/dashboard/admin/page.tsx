"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex flex-col gap-4 w-72">
        <button
          onClick={() => router.push("/dashboard/admin/add")}
          className="p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
        >
          Add Tournament
        </button>

        <button
          onClick={() => router.push("/dashboard/admin/view-tournaments")}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
        >
          View Tournaments
        </button>

        <button
          onClick={() => router.push("/dashboard/admin/view-users")}
          className="p-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded"
        >
          View Users
        </button>
      </div>
    </div>
  );
}
