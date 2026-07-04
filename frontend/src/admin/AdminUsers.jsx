import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/auth/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const adminCount = users.filter(
    (u) => u.role === "admin"
  ).length;

  const customerCount = users.filter(
    (u) => u.role !== "admin"
  ).length;

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
          User Directory
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage all registered ShopNest users
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Total Users
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {users.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Admins
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {adminCount}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Customers
          </p>

          <h2 className="text-3xl font-bold text-emerald-500 mt-2">
            {customerCount}
          </h2>
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-zinc-950 border-b border-white/5">
                <th className="p-5 text-left text-zinc-400">
                  User ID
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Name
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Email
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Role
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-white/5 hover:bg-zinc-800/30 transition"
                >
                  <td className="p-5 text-zinc-300">
                    {u._id.slice(0, 8)}...
                  </td>

                  <td className="p-5 text-white font-medium">
                    {u.name}
                  </td>

                  <td className="p-5 text-zinc-300">
                    {u.email}
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                        u.role === "admin"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-5 text-zinc-400">
                    {new Date(
                      u.createdAt
                    ).toLocaleDateString()}
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

export default AdminUsers;