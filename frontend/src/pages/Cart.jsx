import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { removeFromCart, addToCart } from "../redux/slice/cartSlice";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(
        addToCart({
          ...item,
          qty,
        })
      );
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-20 text-center mt-10">
        <h1 className="text-4xl font-bold text-white mb-4">
          Your Cart is Empty 🛒
        </h1>

        <p className="text-zinc-400 mb-8">
          Looks like you haven't added any products yet.
        </p>

        <Link
          to="/shop"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 rounded-xl text-white font-semibold"
        >
          Continue Shopping
        </Link>
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
      transition={{
        duration: 0.5,
      }}
      className="max-w-7xl mx-auto px-5 py-10"
    >
      <h1 className="text-4xl font-bold text-white mb-10">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {cartItems.map((item) => (
            <motion.div
              key={item.productId}
              whileHover={{
                x: 5,
              }}
              className="bg-zinc-900 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-5"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full md:w-36 h-36 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.name}
                </h3>

                <p className="text-orange-500 font-bold text-lg mb-4">
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mb-4">

                  <button
                    onClick={() =>
                      handleUpdateQty(item, item.qty - 1)
                    }
                    className="h-9 w-9 rounded-lg bg-zinc-800 text-white hover:bg-orange-500 transition"
                  >
                    -
                  </button>

                  <span className="text-white font-semibold">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateQty(item, item.qty + 1)
                    }
                    className="h-9 w-9 rounded-lg bg-zinc-800 text-white hover:bg-orange-500 transition"
                  >
                    +
                  </button>

                </div>

                <button
                  onClick={() =>
                    handleRemove(item.productId)
                  }
                  className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}

        </div>

        {/* Summary */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 h-fit sticky top-24">

          <h2 className="text-2xl font-bold text-white mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between text-zinc-400 mb-3">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between text-zinc-400 mb-6">
            <span>Total Price</span>

            <span className="text-orange-500 font-bold text-xl">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>
    </motion.div>
  );
};

export default Cart;