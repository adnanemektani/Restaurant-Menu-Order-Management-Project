import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import bgImage from "../assets/restaurant-bg.jpg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, password, name });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h1
          className="text-3xl font-bold text-center text-amber-100 mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Create Account
        </h1>
        <p className="text-center text-white/60 mb-8 text-sm">
          Register your restaurant
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-amber-100/80 text-sm mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            placeholder="Pizza Hut"
          />
        </div>

        <div className="mb-4">
          <label className="block text-amber-100/80 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            placeholder="owner@restaurant.com"
          />
        </div>

        <div className="mb-8">
          <label className="block text-amber-100/80 text-sm mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Create Account
        </button>

        <p className="text-center text-white/50 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-amber-400 hover:text-amber-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
