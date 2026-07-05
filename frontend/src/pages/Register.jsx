import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Registration Successful! Please check your email for the Welcome OTP.",
        );

        login(data);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(data.message || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-white outline-none focus:border-orange-500 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition cursor-pointer"
          >
            Register
          </button>

          <p className="text-center text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-400">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
