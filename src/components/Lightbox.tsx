import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface Props {
  src: string | null;
  caption?: string;
  onClose: () => void;
}

/** Simple image lightbox with fade/scale animation. */
export default function Lightbox({ src, caption, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl text-white/80 transition-colors hover:border-gold hover:text-gold"
            onClick={onClose}
          >
            ✕
          </button>
          {src.endsWith(".mp4") ? (
            <motion.video
              src={src}
              autoPlay
              loop
              controls
              playsInline
              className="max-h-[85vh] max-w-[92vw] rounded-2xl border border-gold/20 object-contain shadow-gold"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <motion.img
              src={src}
              alt={caption || ""}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl border border-gold/20 object-contain shadow-gold"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {caption && <p className="mt-4 text-sm text-gray-300">{caption}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
