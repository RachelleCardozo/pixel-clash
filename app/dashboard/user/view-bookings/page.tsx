"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {collection,deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where} from "firebase/firestore";
import app from "@/firebase/config";
import ProtectRoute from "@/components/ProtectRoute";
import { useRouter } from "next/navigation";

export default function ViewBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const user = auth.currentUser;
    if (user) {
      const bookingsRef = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
      const bookingsSnapshot = await getDocs(bookingsRef);
      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    }
  };

  const handleCancelBooking = async (booking: any) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      // 1. Delete booking
      await deleteDoc(doc(db, "bookings", booking.id));

      // 2. Fetch the tournament to update available spots
      const tournamentRef = doc(db, "tournaments", booking.tournamentId);
      const tournamentSnap = await getDoc(tournamentRef);

      if (tournamentSnap.exists()) {
        const tournamentData = tournamentSnap.data();
        const currentAvailableSpots = tournamentData.availableSpots || 0;

        // 3. Update spots (+1)
        await updateDoc(tournamentRef, {
          availableSpots: currentAvailableSpots + 1,
        });
      }

      alert("Booking cancelled successfully!");
      fetchBookings(); // Refresh list
    } catch (error: any) {
      console.error(error.message);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <ProtectRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>

        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/user")}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          ← Back to Dashboard
        </button>

        {bookings.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <li key={booking.id} className="border p-4 rounded shadow bg-white">
                
                {/* Tournament Name as Link */}
                <a
                  href={`/events/${booking.tournamentId}`}
                  className="text-lg font-bold mb-2 text-blue-600 hover:underline block"
                >
                  {booking.tournamentName}
                </a>

                <p className="mb-1">
                  <span className="font-semibold">Registered On: </span>
                  {new Date(booking.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
                <p className="font-semibold text-green-600 mb-4">Status: Registered</p>

                {/* Cancel Booking Button */}
                <button
                  onClick={() => handleCancelBooking(booking)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel Registration
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have no bookings yet.</p>
        )}
      </div>
    </ProtectRoute>
  );
}
