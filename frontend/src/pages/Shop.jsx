import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "motion/react";

const PRODUCTS_PER_PAGE = 8;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { icon: "🔥", name: "All" },
    { icon: "📱", name: "Mobile" },
    { icon: "💻", name: "Laptop" },
    { icon: "🎧", name: "Headphone" },
    { icon: "⌚", name: "Smart Watch" },
    { icon: "🖥", name: "Monitor" },
    { icon: "⌨", name: "Accessory" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "low", label: "Price Low → High" },
    { value: "high", label: "Price High → Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setPriceRange("");
    setRating("");
    setSort("latest");
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (priceRange === "0-10000") {
      filtered = filtered.filter((product) => product.price <= 10000);
    }

    if (priceRange === "10000-50000") {
      filtered = filtered.filter(
        (product) => product.price > 10000 && product.price <= 50000,
      );
    }

    if (priceRange === "50000-100000") {
      filtered = filtered.filter(
        (product) => product.price > 50000 && product.price <= 100000,
      );
    }

    if (priceRange === "100000+") {
      filtered = filtered.filter((product) => product.price > 100000);
    }

    if (rating) {
      filtered = filtered.filter((product) => product.rating >= rating);
    }

    switch (sort) {
      case "low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.reverse();
    }

    return filtered;
  }, [products, search, category, priceRange, rating, sort]);

  // Reset to page 1 whenever filters/sort change the result set
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, priceRange, rating, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build a compact page number list with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-8 py-10 pt-28">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[380px] rounded-3xl overflow-hidden mb-10"
      >
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="Shop"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5">
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            Shop Collection
          </h1>

          <p className="text-zinc-300 mt-4 max-w-2xl text-lg">
            Explore premium smartphones, laptops, gaming gear and accessories.
          </p>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        {categories.map((item) => (
          <motion.button
            key={item.name}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(item.name)}
            className={`p-5 rounded-2xl border cursor-pointer transition ${
              category === item.name
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-zinc-900 border-white/5 text-zinc-300 hover:border-orange-500/40"
            }`}
          >
            <div className="text-4xl mb-2">{item.icon}</div>

            <p className="text-sm font-medium">{item.name}</p>
          </motion.button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block bg-zinc-900 border border-white/5 rounded-3xl p-6 sticky top-24 self-start">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Filters</h2>

            <button
              onClick={clearFilters}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg cursor-pointer"
            >
              Clear
            </button>
          </div>

          <h3 className="text-white font-semibold mb-4">Sort By</h3>

          <div className="space-y-3 text-zinc-300 mb-4">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={sort === option.value}
                  onChange={() => setSort(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>

          <h3 className="text-white font-semibold mb-4">Price Range</h3>

          <div className="space-y-3 text-zinc-300 mb-8">
            <label className="flex gap-2">
              <input
                type="radio"
                name="price"
                checked={priceRange === "0-10000"}
                onChange={() => setPriceRange("0-10000")}
              />
              ₹0 - ₹10,000
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="price"
                checked={priceRange === "10000-50000"}
                onChange={() => setPriceRange("10000-50000")}
              />
              ₹10,000 - ₹50,000
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="price"
                checked={priceRange === "50000-100000"}
                onChange={() => setPriceRange("50000-100000")}
              />
              ₹50,000 - ₹1,00,000
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="price"
                checked={priceRange === "100000+"}
                onChange={() => setPriceRange("100000+")}
              />
              ₹1,00,000+
            </label>
          </div>

          <h3 className="text-white font-semibold mb-4">Rating</h3>

          <div className="space-y-3 text-zinc-300 mb-8">
            <label className="flex gap-2">
              <input
                type="radio"
                name="rating"
                checked={rating === 4}
                onChange={() => setRating(4)}
              />
              ⭐ 4 & Above
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="rating"
                checked={rating === 3}
                onChange={() => setRating(3)}
              />
              ⭐ 3 & Above
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="rating"
                checked={rating === 2}
                onChange={() => setRating(2)}
              />
              ⭐ 2 & Above
            </label>
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Products</h2>

              <p className="text-zinc-400">
                Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1}
                {"–"}
                {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </p>
            </div>

            <input
              type="text"
              placeholder="Search Products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white w-64"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-zinc-900 rounded-3xl min-h-[400px] flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold">
                No Products Found
              </h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500/40"
                  >
                    Prev
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-3 py-2 text-zinc-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-xl border transition ${
                          currentPage === page
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "bg-zinc-900 border-white/5 text-zinc-300 hover:border-orange-500/40"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-500/40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;