import React, {
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const AdminProducts = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category filter state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  // Close the category dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unique list of categories derived from the products
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].filter(Boolean);

  const allSelected =
    categories.length > 0 &&
    selectedCategories.length === categories.length;

  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setVisibleCount(PAGE_SIZE); // reset pagination whenever filter changes
  };

  const handleToggleAll = () => {
    setSelectedCategories(allSelected ? [] : categories);
    setVisibleCount(PAGE_SIZE);
  };

  // Products after applying the category filter
  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((product) =>
          selectedCategories.includes(product.category)
        );

  // Only show `visibleCount` products at a time
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleViewAll = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

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
      className="max-w-7xl mx-auto px-5 py-10 mt-15"
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

        <div className="flex items-center gap-3">
          {/* Category filter dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() =>
                setShowCategoryDropdown((prev) => !prev)
              }
              className="bg-zinc-900 border border-white/10 text-white px-5 py-3 rounded-xl font-medium hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer"
            >
              Select Categories
              {selectedCategories.length > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {showCategoryDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl z-20 p-4">
                <label className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <span className="text-white font-semibold">
                    All
                  </span>
                </label>

                <div className="border-t border-white/5 my-2"></div>

                <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(
                          category
                        )}
                        onChange={() =>
                          handleToggleCategory(category)
                        }
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                      />
                      <span className="text-zinc-200">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/admin/add-product"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition text-center"
          >
            + Add Product
          </Link>
        </div>
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
            {categories.length}
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
          <table
            className="w-full min-w-[900px]"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "12%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>

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
              {visibleProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-zinc-400"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => (
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
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* View All / Load more */}
        {hasMore && (
          <div className="flex justify-center py-6 border-t border-white/5">
            <button
              type="button"
              onClick={handleViewAll}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
            >
              View All ({visibleProducts.length} of{" "}
              {filteredProducts.length})
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default AdminProducts;