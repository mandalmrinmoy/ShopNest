import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const CenterModal = ({
  open,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  showCancel = true,
}) => {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-5"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 border border-orange-500/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <p className="text-white text-lg mb-6">{message}</p>

            <div className="flex justify-center gap-4">
              {showCancel && (
                <button
                  onClick={onCancel}
                  className="px-5 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white transition cursor-pointer"
                >
                  {cancelText}
                </button>
              )}

              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition cursor-pointer"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CenterModal;