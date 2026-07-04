import React from "react";

const Disclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">

        <h2 className="text-4xl font-bold text-white mb-8 pb-4 border-b border-white/10">
          Legal & Site Disclaimer
        </h2>

        <p className="text-zinc-400 leading-8 mb-6">
          The data, interfaces, and graphical components represented across the
          ShopNest domain strictly act as an educational development platform.
          This codebase demonstrates modern e-commerce architecture, design
          patterns, and full-stack engineering concepts for learning and
          portfolio purposes.
        </p>

        <div className="space-y-8">

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              1. Accuracy of Materials
            </h4>

            <p className="text-zinc-400 leading-8">
              The content displayed throughout ShopNest may include placeholder
              text, demo products, stock images, and sample data. Product
              information is intended for demonstration purposes only and may
              not represent actual products or services.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              2. Payment Processing Restrictions
            </h4>

            <p className="text-zinc-400 leading-8">
              No real financial transactions are processed within this demo
              environment. Payment integrations are configured exclusively for
              testing and sandbox usage. No actual charges, deductions, or
              purchases occur through this platform.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              3. External Links
            </h4>

            <p className="text-zinc-400 leading-8">
              ShopNest may contain links to third-party websites or services.
              We do not control, endorse, or assume responsibility for the
              content, privacy policies, or practices of external platforms.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              4. Educational Purpose
            </h4>

            <p className="text-zinc-400 leading-8">
              This project is intended for educational, training, and portfolio
              demonstration purposes. Features, workflows, and integrations are
              implemented to showcase modern MERN stack development practices.
            </p>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-zinc-500 italic text-sm leading-7">
            By accessing and using ShopNest, you acknowledge that this platform
            is provided for demonstration and educational purposes and agree to
            the terms outlined in this disclaimer.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Disclaimer;