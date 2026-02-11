import { useEffect, useRef } from "react";

export function useSoundslicePlayer({ onReady } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    // init player library here if you use the real API
    onReady?.();
    return () => {
      // cleanup/destroy player if needed
    };
  }, [onReady]);

  return { containerRef: ref };
}
