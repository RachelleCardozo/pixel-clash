"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import auth from "@/firebase/auth";
import app from "@/firebase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const db = getFirestore(app);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.data();

      if (userData?.role === "admin") {
        router.push("/dashboard/admin");  
      } else {
        router.push("/dashboard/user");   
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-400 to-purple-500">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">Login to Your Account</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-72">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="p-3 bg-blue-700 text-white font-bold rounded hover:bg-blue-800"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
