import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-5">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl p-[1px]"
      >
        {/* Moving Border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-50%]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, #f97316, transparent 30%)",
          }}
        />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-zinc-950 rounded-3xl p-8 flex flex-col gap-5 border border-orange-500/10"
        >
          <h2 className="text-3xl font-bold text-center text-white">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition cursor-pointer"
          >
            Login
          </button>

          <p className="text-center text-zinc-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-400"
            >
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;