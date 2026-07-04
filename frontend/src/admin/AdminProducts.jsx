import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.ok) {
        setProducts(
          products.filter(
            (product) => product._id !== id
          )
        );

        toast.success(
          "Product deleted successfully"
        );
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Manage Products
          </h1>

          <p className="text-zinc-400 mt-2">
            View, edit and delete products
          </p>
        </div>

        <Link
          to="/admin/add-product"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition text-center"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Total Products
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {products.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Categories
          </p>

          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            {
              new Set(
                products.map(
                  (product) =>
                    product.category
                )
              ).size
            }
          </h2>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <p className="text-zinc-400">
            Total Stock
          </p>

          <h2 className="text-3xl font-bold text-emerald-500 mt-2">
            {products.reduce(
              (acc, product) =>
                acc + product.stock,
              0
            )}
          </h2>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="bg-zinc-950 border-b border-white/5">
                <th className="p-5 text-left text-zinc-400">
                  Image
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Product
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Price
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Category
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Stock
                </th>

                <th className="p-5 text-left text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-white/5 hover:bg-zinc-800/30 transition"
                >
                  <td className="p-5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  </td>

                  <td className="p-5 text-white font-medium">
                    {product.name}
                  </td>

                  <td className="p-5 text-orange-500 font-semibold">
                    ₹
                    {product.price.toFixed(
                      2
                    )}
                  </td>

                  <td className="p-5 text-zinc-300">
                    {product.category}
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                        product.stock > 0
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex gap-3">

                      <Link
                        to={`/admin/edit-product/${product._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                      >
                        Delete
                      </button>

                    </div>
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

export default AdminProducts;