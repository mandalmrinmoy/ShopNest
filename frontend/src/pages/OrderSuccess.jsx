import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const OrderSuccess = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="max-w-3xl mx-auto px-5 py-20"
    >
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <span className="text-5xl">✅</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-500 mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
          Thank you for shopping with ShopNest. Your payment has been
          received successfully and your order is now being processed.
        </p>

        {/* Order Status */}
        <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-zinc-400">
              Payment Status
            </span>

            <span className="text-emerald-500 font-semibold">
              Paid
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Order Status
            </span>

            <span className="text-orange-500 font-semibold">
              Processing
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/shop"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Continue Shopping
          </Link>

          <Link
            to="/profile"
            className="border border-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 transition"
          >
            View Profile
          </Link>

        </div>

      </div>
    </motion.div>
  );
};

export default OrderSuccess;