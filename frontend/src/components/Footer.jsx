import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-5 py-12">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-3">
              ShopNest
            </h3>

            <p className="text-zinc-400 leading-7">
              Premium E-Commerce Platform built
              for seamless online shopping with
              quality products and secure checkout.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h4>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Cart
              </Link>

              <Link
                to="/profile"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Support
            </h4>

            <div className="flex flex-col gap-3">
              <Link
                to="/aboutus"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                About Us
              </Link>

              <Link
                to="/return"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Return Policy
              </Link>

              <Link
                to="/disclaimer"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Disclaimer
              </Link>

              <Link
                to="/contact"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Connect
            </h4>

            <p className="text-zinc-400 mb-2">
              📧 support@shopnest.com
            </p>

            <p className="text-zinc-400 mb-2">
              📍 India
            </p>

            <div className="flex gap-4 mt-5">
              <a
                href="https://github.com/mandalmrinmoy"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-orange-500 text-xl transition"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/mrinmoy-mandal-3b70351b8/"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-orange-500 text-xl transition"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.instagram.com/mrinn_23/"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-orange-500 text-xl transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} ShopNest.
            All rights reserved.
          </p>

          <p className="text-zinc-500 text-sm">
            Built with ❤️ using MERN Stack
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;