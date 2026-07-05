import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/slice/cartSlice";
import toast from "react-hot-toast";

const Checkout = () => {
  const { user } = useContext(AuthContext);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const shippingCost = subtotal > 999 ? 0 : 99;
  const totalPrice = subtotal + shippingCost;

  const bypassPayment = async () => {
  try {
    setLoading(true);

    const saveOrderRes = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        orderItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.qty,
        })),
        shippingAddress: address,
        paymentId: "bypass_" + Date.now(),
      }),
    });

    const data = await saveOrderRes.json();

    console.log("ORDER RESPONSE:", data);

    if (saveOrderRes.ok) {
      toast.success("Order placed successfully!");

      dispatch(clearCart());

      setTimeout(() => {
        navigate("/ordersuccess");
      }, 1000);
    } else {
      toast.error(data.message || "Order saving failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const handlePayment = async () => {
    try {
      setLoading(true);

      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        const fallback = window.confirm(
          "Payment gateway unavailable. Use Demo Order Mode?",
        );

        if (fallback) {
          return bypassPayment();
        }

        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ShopNest",
        description: "ShopNest Order",
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            if (!verifyRes.ok) {
              toast.error("Payment verification failed");
              return;
            }

            const saveOrderRes = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                orderItems: cartItems.map((item) => ({
                  productId: item.productId,
                  quantity: item.qty,
                })),
                shippingAddress: address,
                paymentId: response.razorpay_payment_id,
              }),
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate("/ordersuccess");
            } else {
              toast.error("Order saving failed");
            }
          } catch (err) {
            console.error(err);
          }
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: address.phone,
        },

        theme: {
          color: "#f97316",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      return;
    }

    // handlePayment();
    bypassPayment();
  };

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
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Checkout</h1>

        <p className="text-zinc-400 mt-2">
          Complete your order securely with ShopNest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Shipping Address */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Shipping Address
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={address.fullName}
              onChange={(e) =>
                setAddress({
                  ...address,
                  fullName: e.target.value,
                })
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-400"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              required
              value={address.phone}
              onChange={(e) =>
                setAddress({
                  ...address,
                  phone: e.target.value,
                })
              }
              className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <input
              type="text"
              placeholder="Street Address"
              required
              value={address.street}
              onChange={(e) =>
                setAddress({
                  ...address,
                  street: e.target.value,
                })
              }
              className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <input
              type="text"
              placeholder="City"
              required
              value={address.city}
              onChange={(e) =>
                setAddress({
                  ...address,
                  city: e.target.value,
                })
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <input
              type="text"
              placeholder="Pincode"
              required
              value={address.postalCode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  postalCode: e.target.value,
                })
              }
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <select
              required
              value={address.state}
              onChange={(e) =>
                setAddress({
                  ...address,
                  state: e.target.value,
                })
              }
              className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            >
              <option value="">Select State</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Odisha">Odisha</option>
              <option value="Bihar">Bihar</option>
              <option value="Kerala">Kerala</option>
              <option value="Assam">Assam</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

          <div className="space-y-4 max-h-72 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium">
                    {item.name}
                  </h4>

                  <p className="text-zinc-400 text-xs">Qty: {item.qty}</p>
                </div>

                <span className="text-orange-500 font-semibold">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mt-6 pt-6">
            <div className="flex justify-between text-zinc-400 mb-3">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-zinc-400 mb-3">
              <span>Shipping</span>

              <span className="font-semibold text-emerald-500">
                {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
              </span>
            </div>

            <div className="flex justify-between text-white text-2xl font-bold mt-5">
              <span>Total</span>

              <span className="text-orange-500">₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>

            <p className="text-center text-zinc-500 text-xs mt-4">
              Secure checkout powered by Razorpay
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Checkout;
