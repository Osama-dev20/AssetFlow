import { useEffect, useRef, useState } from "react";

export function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Triggers dynamically on both scroll down and scroll up
        if (entry.isIntersecting) {
          setIsRevealed(true);
        } else {
          // If scrolled out of view from top or bottom
          if (entry.boundingClientRect.top > 0) {
            setIsRevealed(false);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-section ${isRevealed ? "is-revealed" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
