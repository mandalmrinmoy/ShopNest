import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.8,
      }}
      className="max-w-5xl mx-auto px-5 py-10 mt-20"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-[2px] mb-20">
        {/* Moving Outline */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-[-50%] pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(249,115,22,1), transparent 30%)",
          }}
        />

        {/* Hero Content */}
        <section className="relative z-10 rounded-3xl bg-zinc-950 px-8 md:px-12 py-24 text-center overflow-hidden border border-orange-500/10">
          {/* Glow Effects */}
          <div className="absolute top-0 left-0 h-80 w-80 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-80 w-80 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">Welcome to </span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              ShopNest
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Discover premium products, unbeatable deals, and a seamless shopping
            experience.
          </motion.p>

          <Link
            to="/shop"
            className="relative z-20 inline-block"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Shop Now
            </motion.button>
          </Link>
        </section>
      </div>

      {/* Featured Products */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-center mb-3 text-white">
          Featured Products
        </h2>

        <p className="text-center text-zinc-400 mb-12">
          Explore our handpicked collection of premium products.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{
                  y: -8,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="flex justify-center mt-12">
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-900 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition cursor-pointer"
          >
            View All Products →
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Home;