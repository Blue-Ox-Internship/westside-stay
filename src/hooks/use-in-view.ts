import { useEffect, useRef, useState } from "react";

// Lets us defer mounting/playing heavy media (autoplaying videos) until the
// element is actually near the viewport, instead of every video on the page
// competing for bandwidth and decode time at once.
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
