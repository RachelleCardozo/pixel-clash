"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import auth from "@/firebase/auth";
import app from "@/firebase/config";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const db = getFirestore(app);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔥 Save name and email in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        role: "user",
      });

      alert("Signup successful!");
      router.push("/auth/login");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-400 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">Create an Account</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-72">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
          required
        />
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
          placeholder="Password (at least 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="p-3 bg-blue-700 text-white font-bold rounded hover:bg-blue-800"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
