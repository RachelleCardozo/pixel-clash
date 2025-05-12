"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import app from "@/firebase/config";

export default function ViewTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const snapshot = await getDocs(collection(db, "tournaments"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTournaments(data);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tournament?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "tournaments", id));
      alert("Tournament deleted successfully!");
      fetchTournaments(); // 🔥 Refresh list
    }
  };

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View All Tournaments</h1>
      <button
      onClick={() => router.push("/dashboard/admin")}
      className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>
      <input
        type="text"
        placeholder="Search tournaments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-6 border rounded w-80"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTournaments.map((tournament) => (
          <div key={tournament.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{tournament.title}</h3>
            <p>Location: {tournament.location}</p>
            <p>Date: {new Date(tournament.date).toLocaleDateString()}</p>
            <p>Available Spots: {tournament.availableSpots}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => router.push(`/dashboard/admin/edit/${tournament.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(tournament.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
