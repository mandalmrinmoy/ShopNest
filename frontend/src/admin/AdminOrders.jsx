import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === id
              ? { ...order, status }
              : order
          )
        );

        toast.success(
          `Order marked as ${status}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-500";

      case "Shipped":
        return "bg-blue-500/10 text-blue-500";

      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  if (loading) {
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
      className="max-w-7xl mx-auto px-5 py-10"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Manage Orders
        </h1>

        <p className="text-zinc-400 mt-2">
          Track and update customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Total Orders
          </p>

          <h2 className="text-3xl font-bold text-orange-500">
            {orders.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Delivered
          </p>

          <h2 className="text-3xl font-bold text-emerald-500">
            {
              orders.filter(
                (o) =>
                  o.status === "Delivered"
              ).length
            }
          </h2>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-yellow-500">
            {
              orders.filter(
                (o) =>
                  o.status === "Pending"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b border-white/5 bg-zinc-950">
                <th className="text-left p-5 text-zinc-400">
                  Order ID
                </th>

                <th className="text-left p-5 text-zinc-400">
                  Customer
                </th>

                <th className="text-left p-5 text-zinc-400">
                  Total
                </th>

                <th className="text-left p-5 text-zinc-400">
                  Date
                </th>

                <th className="text-left p-5 text-zinc-400">
                  Status
                </th>

                <th className="text-left p-5 text-zinc-400">
                  Update
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-white/5 hover:bg-zinc-800/30 transition"
                >
                  <td className="p-5 text-white">
                    {order._id}
                  </td>

                  <td className="p-5 text-white">
                  {order.user?.name || "Deleted User"}
                  </td>

                  <td className="p-5 text-emerald-500 font-semibold">
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-5 text-zinc-400">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-2 rounded-xl text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrders;