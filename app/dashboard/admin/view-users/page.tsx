"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import app from "@/firebase/config";

export default function ViewUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const db = getFirestore(app);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(data);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "users", id));
      alert("User deleted successfully!");
      fetchUsers(); //Refresh list
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View All Users</h1>
      <button
        onClick={() => router.push("/dashboard/admin")}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-6 border rounded w-80"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="border p-4 rounded shadow">
            <p className="font-bold">{user.name}</p>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => router.push(`/dashboard/admin/edit-user/${user.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
