import { useCallback, useEffect, useState } from "react";

// Lets us defer mounting/playing heavy media (autoplaying videos) until the
// element is actually near the viewport, instead of every video on the page
// competing for bandwidth and decode time at once.
//
// Uses a callback ref (not useRef) because the observed element can mount
// after the component's first render (e.g. exterior media loads async) —
// a plain ref would miss that and never attach the observer.
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin]);

  return { ref, inView };
}
