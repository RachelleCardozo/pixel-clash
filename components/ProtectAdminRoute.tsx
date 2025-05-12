"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import app from "@/firebase/config";
import auth from "@/firebase/auth";

export default function ProtectAdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        if (userData?.role !== "admin") {
          alert("Access Denied. Admins only.");
          router.push("/dashboard/user");
        } else {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
