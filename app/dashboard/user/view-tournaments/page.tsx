"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "@/firebase/config";
import ProtectRoute from "@/components/ProtectRoute";
import TournamentCard from "@/components/TournamentCard";
import { useRouter } from "next/navigation";

export default function ViewTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const snapshot = await getDocs(collection(db, "tournaments"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTournaments(data);
    setFilteredTournaments(data); // initialize filtered tournaments
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = tournaments.filter((tournament: any) =>
      tournament.title.toLowerCase().includes(term) ||
      tournament.location.toLowerCase().includes(term)
    );

    setFilteredTournaments(filtered);
  };

  return (
    <ProtectRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Available Tournaments</h1>

        {/* back Button */}
        <button
          onClick={() => router.push("/dashboard/user")}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          ← Back to Dashboard
        </button>
        {/* Tournament Count */}
        <div className="text-center mb-4 text-gray-700 font-semibold">
          {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? "s" : ""} found
        </div>
        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by tournament name or location..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded w-96 shadow"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))
          ) : (
            <p>No tournaments found.</p>
          )}
        </div>
      </div>
    </ProtectRoute>
  );
}
