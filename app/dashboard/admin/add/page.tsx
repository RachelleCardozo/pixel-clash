"use client";

import { useState } from "react";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import app from "@/firebase/config";

export default function AddTournamentPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [availableSpots, setAvailableSpots] = useState(0);
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  const db = getFirestore(app);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks before saving
    if (!title || !location || !date || !availableSpots || locationLat === null || locationLng === null) {
      alert("Please fill in all fields before submitting!");
      return; 
    }

    try {
      await addDoc(collection(db, "tournaments"), {
        title,
        location,
        date,
        availableSpots,
        locationLat,
        locationLng,
      });

      alert("Tournament added successfully!");
      router.push("/dashboard/admin/view-tournaments");
    } catch (error: any) {
      console.error(error.message);
      alert("Failed to add tournament. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-400 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-8">Add New Tournament</h1>
      <button
        onClick={() => router.push("/dashboard/admin")}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow">
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
          Add Tournament
        </button>
      </form>
    </div>
  );
}
