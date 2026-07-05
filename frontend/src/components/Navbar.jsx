import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {/* <img
              src="/ShopNestLogo.png"
              alt="ShopNest"
              className="h-10 w-10 rounded-lg object-cover"
            /> */}

            <span className="text-2xl font-bold">
              <span className="text-white">Shop</span>
              <span className="text-orange-500">Nest</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link
                to="/"
                className="text-zinc-300 hover:text-orange-500 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="text-zinc-300 hover:text-orange-500 transition"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="text-zinc-300 hover:text-orange-500 transition"
              >
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="text-zinc-300 hover:text-orange-500 transition"
                  >
                    Hi, {user.name}
                  </Link>
                </li>

                {user.role === "admin" && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-zinc-300 hover:text-orange-500 transition"
                    >
                      Admin
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-xl font-medium hover:scale-105 transition"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="md:hidden pb-5"
          >
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-zinc-300 hover:text-orange-500"
                >
                  Home
                </Link>

                <Link
                  to="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="text-zinc-300 hover:text-orange-500"
                >
                  Shop
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="text-zinc-300 hover:text-orange-500"
                >
                  Cart ({cartItems.length})
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-zinc-300 hover:text-orange-500"
                    >
                      Profile
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="text-zinc-300 hover:text-orange-500"
                      >
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white py-2 rounded-xl"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-orange-500 text-white py-2 rounded-xl text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
