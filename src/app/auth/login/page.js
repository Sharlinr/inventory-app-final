// app/login/page.js

"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/context/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  //const [loading, setLoading] = useState(true); 
  const router = useRouter(); 
  const { setToken } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token); 
      router.push("/items");
    } else {
      const data = await response.json();
      setError(data.message || "Failed to login");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

