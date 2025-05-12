"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoc, updateDoc, doc, getFirestore } from "firebase/firestore";
import app from "@/firebase/config";

export default function EditTournamentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const db = getFirestore(app);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [availableSpots, setAvailableSpots] = useState(0);
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    const docRef = doc(db, "tournaments", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setTitle(data.title);
      setLocation(data.location);
      setDate(data.date);
      setAvailableSpots(data.availableSpots);
      setLocationLat(data.locationLat);
      setLocationLng(data.locationLng);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "tournaments", id);
      await updateDoc(docRef, {
        title,
        location,
        date,
        availableSpots,
        locationLat,
        locationLng,
      });
      alert("Tournament updated successfully!");
      router.push("/dashboard/admin/view-tournaments");
    } catch (error: any) {
      console.error(error.message);
      alert("Failed to update tournament.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-yellow-400 to-pink-500">
      <h1 className="text-4xl font-bold text-white mb-8">Edit Tournament</h1>
      <button
        onClick={() => router.push("/dashboard/admin/view-tournaments")}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to View Tournaments
      </button>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow">
        <input
          type="text"
          placeholder="Tournament Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Location Name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Available Spots"
          value={availableSpots}
          onChange={(e) => setAvailableSpots(Number(e.target.value))}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Location Latitude"
          value={locationLat ?? ""}
          onChange={(e) => setLocationLat(parseFloat(e.target.value))}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Location Longitude"
          value={locationLng ?? ""}
          onChange={(e) => setLocationLng(parseFloat(e.target.value))}
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded"
        >
          Update Tournament
        </button>
      </form>
    </div>
  );
}
