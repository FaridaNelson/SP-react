import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// If URL has a hash, scroll to the corresponding element.
// Otherwise, scroll to top of the page on route change.
export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === "POP") return; // Don't scroll on back/forward navigation
    if (hash) {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior, block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, hash, navType, behavior]);

  return null;
}
