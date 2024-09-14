// app/page.js
"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
export default function Home() {
  const { token, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Inventory App</h1>

      <div className="space-y-4">
        {/* Knapp för att länka till registreringssidan */}
        <button
          onClick={() => router.push("/auth/register")} // Navigerar till registreringssidan
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>

        {/* Om användaren är inloggad, visa knappen till items-sidan */}
        {token ? (
          <div>
            <button
              onClick={() => router.push("/items")} // Navigerar till items-sidan
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go to Items
            </button>

            {/* Logga ut-knapp */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded ml-4"
            >
              Log out
            </button>
          </div>
        ) : (
          // Om användaren inte är inloggad, visa logga in-knappen
          <button
            onClick={() => router.push("/auth/login")} // Navigerar till inloggningssidan
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}



/*import AuthForm from "@/components/AuthForm";

export default async function Home() {

  return (
    <main className="min-h-screen w-full">
      Login
      <AuthForm/>
    </main>
  )
}*/