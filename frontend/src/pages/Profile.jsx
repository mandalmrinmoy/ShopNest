import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import CenterModal from "../components/centerModal";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  
    const confirmLogout = () => {
      setShowConfirm(false);

      logout();

      toast.success("Logout successful!");

      navigate("/login");
    };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await fetch("/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          if (res.status === 401) {
            logout();
            navigate("/login");
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  if (!user) return null;

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="max-w-7xl mx-auto px-5 py-10 mt-20"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT SIDE: Profile + Stats */}
          <div>
            {/* Profile Header */}
            <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 mb-5">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    My Profile
                  </h1>

                  <p className="text-zinc-400">
                    Manage your account and orders
                  </p>

                  <div className="mt-6 space-y-3">
                    <p className="text-white">
                      <span className="text-zinc-400">Name:</span> {user.name}
                    </p>

                    <p className="text-white">
                      <span className="text-zinc-400">Email:</span> {user.email}
                    </p>

                    <span className="inline-block bg-orange-500/10 text-orange-500 px-4 py-2 rounded-xl font-semibold">
                      {user.role?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium cursor-pointer h-fit"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5">
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                <p className="text-zinc-400 mb-2">Total Orders</p>

                <h2 className="text-3xl font-bold text-white">
                  {orders.length}
                </h2>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                <p className="text-zinc-400 mb-2">Account Type</p>

                <h2 className="text-3xl font-bold text-orange-500">
                  {user.role}
                </h2>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                <p className="text-zinc-400 mb-2">Member Of</p>

                <h2 className="text-3xl font-bold text-emerald-500">
                  ShopNest
                </h2>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Order History */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white">Order History</h2>

              <p className="text-zinc-400 mt-2">
                Track all your previous orders
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-10 text-center">
                <h3 className="text-2xl font-semibold text-white mb-3">
                  No Orders Yet
                </h3>

                <p className="text-zinc-400 mb-6">
                  Looks like you haven't placed any orders.
                </p>

                <Link
                  to="/shop"
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    whileHover={{
                      y: -3,
                    }}
                    className="bg-zinc-900 border border-white/5 rounded-2xl p-6"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                      <div>
                        <p className="text-zinc-400 text-sm mb-1">Order ID</p>

                        <p className="text-white break-all">{order._id}</p>

                        <p className="text-zinc-400 mt-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        <p className="text-emerald-500 font-bold mt-2 text-lg">
                          ₹{order.totalPrice?.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-start">
                        <span
                          className={`px-4 py-2 rounded-xl font-semibold ${
                            order.status === "Delivered"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : order.status === "Shipped"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <CenterModal
        open={showConfirm}
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default Profile;
