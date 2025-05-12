"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "@/firebase/config";
import dynamic from "next/dynamic";

// Dynamic import of MapView (ssr: false)
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const db = getFirestore(app);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const tournamentsSnapshot = await getDocs(collection(db, "tournaments"));
    const tournamentsData = tournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTournaments(tournamentsData);
    setFilteredTournaments(tournamentsData); // Initialize filtered list
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Events on the Map</h1>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 bg-white z-10 py-4 flex justify-center shadow-md">
        <input
          type="text"
          placeholder="Search by tournament name or location..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded w-96 shadow"
        />
      </div>

      {/*  Tournament Count */}
      <div className="text-center mb-4 text-gray-700 font-semibold">
        {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? "s" : ""} found
      </div>

      {/* Map or No Tournaments */}
      {filteredTournaments.length > 0 ? (
        <MapView tournaments={filteredTournaments} />
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-500">
          <p className="text-xl font-semibold mb-2">No tournaments found.</p>
          <p className="text-md">Try adjusting your search terms!</p>
        </div>
      )}
    </div>
  );
}
