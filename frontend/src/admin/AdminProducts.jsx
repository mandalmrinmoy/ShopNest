import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const AdminProducts = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].filter(Boolean),
    [products]
  );

  const allSelected =
    categories.length > 0 && selectedCategories.length === categories.length;

  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleToggleAll = () => {
    setSelectedCategories(allSelected ? [] : categories);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter((p) => selectedCategories.includes(p.category));
  }, [products, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted successfully");
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 max-w-7xl px-4 py-8 sm:mt-14 sm:px-6 sm:py-10"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-4xl">
            Manage Products
          </h1>
          <p className="mt-1 text-sm text-zinc-400 sm:mt-2 sm:text-base">
            View, edit and delete products
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          {/* Category filter dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 sm:px-5 sm:py-3 sm:text-base"
            >
              Select Categories
              {selectedCategories.length > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {showCategoryDropdown && (
              <div className="absolute right-0 z-20 mt-2 w-64 max-w-[80vw] rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-xl sm:rounded-2xl sm:p-4">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                    className="h-4 w-4 cursor-pointer accent-orange-500"
                  />
                  <span className="text-sm font-semibold text-white sm:text-base">
                    All
                  </span>
                </label>

                <div className="my-2 border-t border-white/5" />

                <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleToggleCategory(category)}
                        className="h-4 w-4 cursor-pointer accent-orange-500"
                      />
                      <span className="text-sm text-zinc-200 sm:text-base">
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
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:scale-105 sm:px-6 sm:py-3 sm:text-base"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-5">
        <div className="col-span-2 rounded-xl border border-white/5 bg-zinc-900 p-4 sm:col-span-1 sm:rounded-2xl sm:p-6">
          <p className="text-sm text-zinc-400 sm:text-base">Total Products</p>
          <h2 className="mt-1 text-2xl font-bold text-orange-500 sm:mt-2 sm:text-3xl">
            {products.length}
          </h2>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900 p-4 sm:rounded-2xl sm:p-6">
          <p className="text-sm text-zinc-400 sm:text-base">Categories</p>
          <h2 className="mt-1 text-2xl font-bold text-blue-500 sm:mt-2 sm:text-3xl">
            {categories.length}
          </h2>
        </div>

        <div className="rounded-xl border border-white/5 bg-zinc-900 p-4 sm:rounded-2xl sm:p-6">
          <p className="text-sm text-zinc-400 sm:text-base">Total Stock</p>
          <h2 className="mt-1 text-2xl font-bold text-emerald-500 sm:mt-2 sm:text-3xl">
            {products.reduce((acc, p) => acc + p.stock, 0)}
          </h2>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "12%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>

            <thead>
              <tr className="border-b border-white/5 bg-zinc-950">
                {["Image", "Product", "Price", "Category", "Stock", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="p-4 text-left text-sm text-zinc-400 sm:p-5 sm:text-base"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-zinc-400 sm:text-base"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-white/5 transition hover:bg-zinc-800/30"
                  >
                    <td className="p-4 sm:p-5">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-14 w-14 rounded-xl object-contain sm:h-16 sm:w-16"
                      />
                    </td>

                    <td className="p-4 text-sm font-medium text-white sm:p-5 sm:text-base">
                      {product.name}
                    </td>

                    <td className="p-4 text-sm font-semibold text-orange-500 sm:p-5 sm:text-base">
                      ₹{product.price.toFixed(2)}
                    </td>

                    <td className="p-4 text-sm text-zinc-300 sm:p-5 sm:text-base">
                      {product.category}
                    </td>

                    <td className="p-4 sm:p-5">
                      <span
                        className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold sm:px-3 sm:py-2 sm:text-sm ${
                          product.stock > 0
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5">
                      <div className="flex gap-2 sm:gap-3">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600 sm:px-4 sm:text-sm"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="cursor-pointer rounded-xl bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600 sm:px-4 sm:text-sm"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/5 px-4 py-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-white/5 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`rounded-xl border px-4 py-2 text-sm transition sm:text-base ${
                  currentPage === page
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-white/5 bg-zinc-800 text-zinc-300 hover:border-orange-500/40"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-white/5 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminProducts;