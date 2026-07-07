import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStats(data);
        } else {
          setStats({
            totalOrders: 0,
            totalProducts: 0,
            totalUsers: 0,
            totalRevenue: 0,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="max-w-7xl mx-auto px-5 py-10 mt-15"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src="/ShopNestLogo.png"
          alt="ShopNest"
          className="h-12 w-12 rounded-xl"
        />

        <div>
          <h1 className="text-4xl font-bold text-white">
            Admin Dashboard
          </h1>

          <p className="text-zinc-400">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-zinc-900 border border-white/5 rounded-3xl p-6"
        >
          <p className="text-zinc-400 mb-2">
            Total Orders
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            {stats.totalOrders}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-zinc-900 border border-white/5 rounded-3xl p-6"
        >
          <p className="text-zinc-400 mb-2">
            Products
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            {stats.totalProducts}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-zinc-900 border border-white/5 rounded-3xl p-6"
        >
          <p className="text-zinc-400 mb-2">
            Users
          </p>

          <h2 className="text-4xl font-bold text-orange-500">
            {stats.totalUsers}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-zinc-900 border border-white/5 rounded-3xl p-6"
        >
          <p className="text-zinc-400 mb-2">
            Revenue
          </p>

          <h2 className="text-4xl font-bold text-emerald-500">
            ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
          </h2>
        </motion.div>

      </div>

      {/* Controls */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Administrative Controls
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          <button
            onClick={() =>
              navigate("/admin/add-product")
            }
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 rounded-2xl font-semibold cursor-pointer hover:scale-105 transition"
          >
            ➕ Add Product
          </button>

          <button
            onClick={() =>
              navigate("/admin/products")
            }
            className="bg-zinc-800 text-white p-5 rounded-2xl font-semibold cursor-pointer hover:bg-zinc-700 transition"
          >
            📦 Products
          </button>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
            className="bg-zinc-800 text-white p-5 rounded-2xl font-semibold cursor-pointer hover:bg-zinc-700 transition"
          >
            🚚 Orders
          </button>

          <button
            onClick={() =>
              navigate("/admin/users")
            }
            className="bg-zinc-800 text-white p-5 rounded-2xl font-semibold cursor-pointer hover:bg-zinc-700 transition"
          >
            👥 Users
          </button>

        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;