"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Image from "next/image";
import auth from "@/firebase/auth";
import app from "@/firebase/config";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        const fullName = userData?.name || "User";
        const firstName = fullName.split(" ")[0];
        setUserName(firstName);
        setUserRole(userData?.role || "user"); // 🔥 Save user role too
      } else {
        setIsLoggedIn(false);
        setUserName(null);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleDashboard = () => {
    if (userRole === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow relative">
      {/* Brand */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Image src="/logo.jpeg" alt="Pixel Clash Logo" width={32} height={32} />
        Pixel Clash
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center text-lg">
        {isLoggedIn && (
          <>
            <span className="text-lg font-semibold text-gray-300">Hello, {userName}</span>
            <button onClick={handleDashboard} className="hover:underline">
              Dashboard
            </button>
            <button onClick={() => router.push("/map")} className="hover:underline">
              Map
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="flex md:hidden">
        {isLoggedIn && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            ☰
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-gray-800 p-4 rounded shadow-md flex flex-col gap-4 md:hidden">
          <span className="text-lg font-semibold text-gray-300">Hello, {userName}</span>
          <button onClick={handleDashboard} className="hover:underline">
            Dashboard
          </button>
          <button onClick={() => router.push("/map")} className="hover:underline">
            Map
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
