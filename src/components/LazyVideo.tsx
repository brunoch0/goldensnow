import { useEffect, useRef } from "react";

interface Props {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Video that only loads + plays while in (or near) the viewport.
 * Uses preload="none" so bytes aren't fetched until needed, and
 * pauses when scrolled away — keeps mobile decoder/battery/data low
 * even with many videos on one page.
 */
export default function LazyVideo({ src, poster, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          el.play().catch(() => {
            /* autoplay can be blocked; poster stays visible */
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: "150px", threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
