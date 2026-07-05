import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
    <motion.div
      whileHover={{
        y: -8,
      }}
      className="group bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition h-full flex flex-col"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-50 object-contain bg-white p-4 group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-wider text-orange-500">
          {product.category}
        </span>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-yellow-400">⭐</span>

          <span className="text-sm text-zinc-300">
            {product.rating?.toFixed(1) || "0.0"}
          </span>

          <span className="text-xs text-zinc-500">
            ({product.numReviews || 0} Reviews)
          </span>
        </div>

        <h3 className="text-white text-lg font-semibold mt-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-zinc-400 text-sm mt-2 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-5">
          <span className="text-2xl font-bold text-orange-500">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <Link
            to={`/product/${product._id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

export default ProductCard;
