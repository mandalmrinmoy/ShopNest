import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { addToCart } from "../redux/slice/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const isInCart = cartItems.some(
    (item) => item.productId === product?._id
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1,
      })
    );

    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      style: {
        background: "#18181b",
        color: "#fff",
        border: "1px solid #f97316",
      },
      iconTheme: {
        primary: "#f97316",
        secondary: "#fff",
      },
    });
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!isInCart) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty: 1,
        })
      );
    }

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
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
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 text-red-500 text-xl">
        Product Not Found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-5 py-10"
    >
      {/* Breadcrumb */}
      <div className="text-zinc-400 mb-8 text-sm">
        <Link
          to="/"
          className="text-orange-500 hover:text-orange-400"
        >
          Home
        </Link>

        {" / "}

        <Link
          to="/shop"
          className="text-orange-500 hover:text-orange-400"
        >
          Shop
        </Link>

        {" / "}

        <span>{product.category}</span>

        {" / "}

        <span className="text-white">{product.name}</span>
      </div>

      {/* Product Card */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Product Image */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="overflow-hidden rounded-2xl"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </motion.div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-orange-500 mb-6">
              ₹{Number(product.price).toFixed(2)}
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">
                Product Description
              </h3>

              <p className="text-zinc-400 leading-8">
                {product.description}
              </p>
            </div>

            <div className="mb-8">
              {product.stock > 0 ? (
                <p className="text-emerald-500 font-semibold">
                  ● In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-500 font-semibold">
                  ● Out of Stock
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">

              {isInCart ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/cart")}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg cursor-pointer"
                >
                  Go to Cart 🛒
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Add to Cart
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyNow}
                className="flex-1 bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-zinc-200 cursor-pointer"
              >
                Buy Now
              </motion.button>

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;