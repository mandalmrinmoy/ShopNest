import React from "react";
import photo from "../assets/mrinmoy.jpg";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="bg-zinc-900 border border-white/5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-10 text-center">
        {/* Profile Image */}
        <img
          src={photo}
          alt="Profile"
          className="w-44 h-44 mx-auto rounded-full object-cover border-4 border-orange-500 shadow-[0_4px_20px_rgba(249,115,22,0.4)] mb-6"
        />

        {/* Heading */}
        <h2 className="text-4xl font-bold text-white mb-3">About Me</h2>

        <h3 className="text-2xl font-semibold text-orange-500 mb-6">
          Mrinmoy Mandal
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-lg leading-8 max-w-2xl mx-auto mb-10">
          <strong>
            I'm Mrinmoy Mandal, a MERN Stack Developer focused on creating
            modern, scalable, and user-friendly web applications. ShopNest is
            one of my full-stack projects, built to demonstrate my expertise in
            React, Node.js, Express, MongoDB, and modern UI development.
          </strong>
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/mandalmrinmoy"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
          >
            🔗 Github
          </a>

          <a
            href="https://www.instagram.com/mrinn_23/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/30 hover:bg-pink-500/20 transition-all duration-300"
          >
            📸 Instagram
          </a>

          <a
            href="https://www.linkedin.com/in/mrinmoy-mandal-3b70351b8/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20 transition-all duration-300"
          >
            💼 LinkedIn
          </a>

          <a
            href="https://whatsapp.com/channel/0029VbAWGE5ICVfcjjKTAS0B"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all duration-300"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
