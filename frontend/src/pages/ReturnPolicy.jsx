import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">

        <h2 className="text-4xl font-bold text-white mb-8 pb-4 border-b border-white/10">
          Return & Refund Policy
        </h2>

        <p className="text-zinc-400 leading-8 mb-6">
          At ShopNest, we stand behind the quality of our products. If you are
          not completely satisfied with your purchase, you may request a return
          within 30 days of receiving your order, subject to the conditions
          outlined below.
        </p>

        <div className="space-y-8">

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              1. Eligibility for Returns
            </h4>

            <p className="text-zinc-400 leading-8">
              To qualify for a return, the item must be unused, in its original
              condition, and returned with all original packaging, accessories,
              and proof of purchase. Products showing signs of misuse or damage
              may not be eligible for return.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              2. Refund Processing
            </h4>

            <p className="text-zinc-400 leading-8">
              Once your returned item has been received and inspected, we will
              notify you regarding the approval or rejection of your refund.
              Approved refunds are typically processed within 5–7 business days
              and credited to the original payment method.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              3. Non-Returnable Items
            </h4>

            <p className="text-zinc-400 leading-8">
              Certain products are not eligible for return, including digital
              products, downloadable software, gift cards, personalized items,
              perishable goods, and products that have been modified, damaged,
              or tampered with after delivery.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-orange-500 mb-3">
              4. Shipping Costs
            </h4>

            <p className="text-zinc-400 leading-8">
              Customers are responsible for return shipping costs unless the
              item was received damaged, defective, or incorrect. Original
              shipping charges are generally non-refundable unless required by
              applicable consumer protection laws.
            </p>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-zinc-500 italic text-sm leading-7">
            By placing an order through ShopNest, you acknowledge and agree to
            the terms of this Return & Refund Policy.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ReturnPolicy;