"use client";

import { useRouter } from "next/navigation";

export default function TournamentCard({ tournament }: { tournament: any }) {
  const router = useRouter();

  const handleRegister = () => {
    router.push(`/events/${tournament.id}`);
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold">{tournament.title}</h3>
      <p className="text-gray-600">{tournament.location}</p>
      <p className="text-gray-600">{new Date(tournament.date).toLocaleDateString()}</p>
      <p>Spots Left: {tournament.availableSpots}</p>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleRegister}
      >
        View Details / Register
      </button>
    </div>
  );
}