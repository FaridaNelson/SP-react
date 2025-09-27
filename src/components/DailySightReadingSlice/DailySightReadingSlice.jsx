import { useEffect, useState } from "react";
import "./DailySightReadingSlice.css";

export default function DailySightReadingSlice() {
  const [state, setState] = useState({ loading: tru });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/soundslice/daily");
        const data = await r.json();
        if (!alive) return;
        if (!r.ok) throw new Error(data?.error || "Request failed");
        setState({ loading: false, data });
      } catch (e) {
        setState({ loading: false, error: e.message });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading)
    return <div className="sslice__loading">Loading slice...</div>;
  if (state.error)
    return <div className="sslice__error">Error: {state.error}</div>;

  const { embed_url, name } = state.data || {};
  if (!embed_url) {
    return (
      <div className="sslice__error">
        This slice is not enabled for embedding.
      </div>
    );
  }

  return (
    <div className="sslice__wrap">
      <iframe
        className="sslice__frame"
        title={name || "Sight-Reading"}
        src={embed_url}
        loading="lazy"
        allow="autoplay; clipboard-write; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  );
}
