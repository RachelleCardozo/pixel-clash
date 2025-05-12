"use client";

import { useRouter } from "next/navigation";
import ProtectRoute from "@/components/ProtectRoute";

export default function UserDashboard() {
  const router = useRouter();

  return (
    <ProtectRoute>
      <div className="p-6 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>

        <div className="flex flex-col gap-4 w-72">
          <button
            onClick={() => router.push("/dashboard/user/view-tournaments")}
            className="p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
          >
            View Tournaments
          </button>

          <button
            onClick={() => router.push("/dashboard/user/view-bookings")}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
          >
            View Bookings
          </button>
        </div>
      </div>
    </ProtectRoute>
  );
}
