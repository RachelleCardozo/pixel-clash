"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/auth/signup");
  };

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-400 to-purple-500">
      <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
        Pixel Clash
      </h1>

      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={handleSignUp}
          className="bg-white text-blue-500 font-bold py-3 rounded shadow hover:bg-gray-200"
        >
          Sign Up
        </button>
        <button
          onClick={handleSignIn}
          className="bg-blue-700 text-white font-bold py-3 rounded hover:bg-blue-800"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
