"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoc, updateDoc, doc, getFirestore } from "firebase/firestore";
import app from "@/firebase/config";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const db = getFirestore(app);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        name,
        email,
        role,
      });
      alert("User updated successfully!");
      router.push("/dashboard/admin/view-users");
    } catch (error: any) {
      console.error(error.message);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-400 to-blue-500">
      <h1 className="text-4xl font-bold text-white mb-8">Edit User</h1>
      <button
        onClick={() => router.push("/dashboard/admin/view-users")}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to View Users
      </button>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow">
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
        <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-2 border rounded"
        required
      >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        </select>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
