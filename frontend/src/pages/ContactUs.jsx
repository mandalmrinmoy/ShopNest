import React, { useState } from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-5 py-10"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          Contact Us
        </h1>

        <p className="text-zinc-400 text-lg">
          We'd love to hear from you. Reach out anytime.
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-white font-semibold text-xl mb-2">
            Email
          </h3>
          <p className="text-zinc-400">
            support@shopnest.com
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 text-center">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="text-white font-semibold text-xl mb-2">
            Phone
          </h3>
          <p className="text-zinc-400">
            +91 98765 43210
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 text-center">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-white font-semibold text-xl mb-2">
            Location
          </h3>
          <p className="text-zinc-400">
            Haldia, West Bengal, India
          </p>
        </div>
      </div>

      {/* Contact Form + Hours */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Send Message
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <input
              type="text"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subject: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <textarea
              rows="6"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  message: e.target.value,
                })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-[1.02] transition cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Business Hours */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
            <h3 className="text-2xl font-bold text-white mb-5">
              Business Hours
            </h3>

            <div className="space-y-3 text-zinc-400">
              <p>
                Monday - Friday
                <br />
                9:00 AM - 6:00 PM
              </p>

              <p>
                Saturday
                <br />
                10:00 AM - 4:00 PM
              </p>

              <p>
                Sunday
                <br />
                Closed
              </p>
            </div>
          </div>

          {/* Developer Info */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
            <h3 className="text-2xl font-bold text-white mb-5">
              Developer
            </h3>

            <p className="text-zinc-400 mb-2">
              Mrinmoy Mandal
            </p>

            <p className="text-zinc-400 mb-2">
              MERN Stack Developer
            </p>

            <p className="text-zinc-400">
              ShopNest Project
            </p>
          </div>

          {/* Social */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
            <h3 className="text-2xl font-bold text-white mb-5">
              Follow Us
            </h3>

            <div className="flex gap-5 text-3xl">
              <a
                href="https://github.com/mandalmrinmoy"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/mrinmoy-mandal-3b70351b8/"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.instagram.com/mrinn_23/"
                className="text-zinc-400 hover:text-orange-500 transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;