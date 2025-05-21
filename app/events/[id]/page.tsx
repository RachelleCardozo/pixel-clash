"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, addDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/config";
import auth from "@/firebase/auth";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const db = getFirestore(app);

  const [tournament, setTournament] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    fetchTournament();
    checkUserStatus();
  }, []);

  const fetchTournament = async () => {
    const docRef = doc(db, "tournaments", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTournament(docSnap.data());
    }
  };

  const checkUserStatus = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setUserRole(userData?.role || "user");

        // Check if the user has already registered
        const bookingsRef = collection(db, "bookings");
        const existingBookingQuery = query(
          bookingsRef,
          where("userId", "==", user.uid),
          where("tournamentId", "==", id)
        );
        const existingBookingSnapshot = await getDocs(existingBookingQuery);

        if (!existingBookingSnapshot.empty) {
          setHasRegistered(true);
        }
      }
    });
  };

  const handleRegister = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first!");
      router.push("/auth/login");
      return;
    }

    if (tournament.availableSpots <= 0) {
      alert("No spots available.");
      return;
    }

    try {
      // Check again before adding booking
      const bookingsRef = collection(db, "bookings");
      const existingBookingQuery = query(
        bookingsRef,
        where("userId", "==", user.uid),
        where("tournamentId", "==", id)
      );
      const existingBookingSnapshot = await getDocs(existingBookingQuery);

      if (!existingBookingSnapshot.empty) {
        alert("You have already registered for this tournament!");
        return;
      }
      // Add booking
      await addDoc(bookingsRef, {
        userId: user.uid,
        tournamentId: id,
        tournamentName: tournament.title,
        createdAt: new Date(),
      });
      // Update available spots
      const tournamentRef = doc(db, "tournaments", id);
      await updateDoc(tournamentRef, {
        availableSpots: tournament.availableSpots - 1,
      });
      
      alert("Registration successful!");
      router.push("/dashboard/user");
    } catch (error: any) {
      console.error(error.message);
      alert("Failed to register.");
    }
  };

  if (!tournament) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{tournament.title}</h1>
      <p className="mb-2">Location: {tournament.location}</p>
      <p className="mb-2">Date: {new Date(tournament.date).toLocaleDateString()}</p>
      <p className="mb-6">Available Spots: {tournament.availableSpots}</p>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      {/*  Conditional Rendering based on role and registration */}
      {userRole === "user" && !hasRegistered && tournament.availableSpots > 0 && (
        <button
          onClick={handleRegister}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      )}

      {userRole === "user" && hasRegistered && (
        <p className="text-green-600 font-bold text-lg mt-4">
          You are already registered for this tournament.
        </p>
      )}

      {userRole === "user" && tournament.availableSpots <= 0 && !hasRegistered && (
        <p className="text-red-600 font-bold text-lg mt-4">
          No available spots remaining.
        </p>
      )}
    </div>
  );
}
