import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api.js";
import { useSoundslicePlayer } from "../../hooks/useSoundslicePlayer.js";
import "./DailySightReadingSlice.css";

const SS_ORIGIN = "https://www.soundslice.com";

export default function DailySightReadingSlice({
  sliceId = "r7RTc",
  useApi = false,
  meta = {},
  showControls = true,
}) {
  const iframeRef = useRef(null);

  const {
    togglePlay,
    seekBy,
    setTime,
    setTempo,
    toggleMetronome,
    setZoom,
    setLayout,
    transpose,
    setViz, // <- setLayout (not setSalyour)
    isReady,
    isPlaying,
    time,
    duration,
    tempo,
  } = useSoundslicePlayer(iframeRef, { origin: SS_ORIGIN, debug: false });

  // If not fetching, seed local slice from props
  const [slice, setSlice] = useState(
    useApi
      ? null
      : {
          id: sliceId,
          title: meta.title || "Daily Sight-Reading",
          artist: meta.artist || "",
          description: meta.description || "",
          url: `https://www.soundslice.com/slices/${sliceId}/`,
        }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(useApi);

  // Optional fetch path (when you flip useApi to true later)
  useEffect(() => {
    if (!useApi) return;
    let alive = true;
    (async () => {
      try {
        const data = await api(`/api/soundslice/${sliceId}`); // or /daily
        const s = data?.slice || data || {};
        const id = s.scorehash || s.id;
        if (!id) throw new Error("Slice missing id");
        if (!alive) return;
        setSlice({
          id,
          title: s.name || s.title || "Daily Sight-Reading",
          artist: s.artist || "",
          description: s.description || "",
          url: s.url || `https://www.soundslice.com/slices/${id}/`,
          embed_url: s.embed_url,
        });
      } catch (e) {
        if (alive) setError(e.message || "Failed to load slice");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [useApi, sliceId]);

  if (loading) return <p>Loading slice...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!slice?.id) return <p className="error">No slice configured.</p>;

  const src = `https://www.soundslice.com/slices/${slice.id}/embed/?api=1`;

  return (
    <div className="dailySlice">
      <h3 className="dailySlice__title">{slice.title}</h3>
      {slice.artist && <p className="dailySlice__artist">by {slice.artist}</p>}

      <div className="dailySlice__frame">
        <iframe
          id="ssembed"
          ref={iframeRef}
          title={slice.title}
          src={src}
          loading="lazy"
          allow="autoplay *; fullscreen *"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {slice.description && (
        <p className="dailySlice__desc">{slice.description}</p>
      )}

      {showControls && (
        <div className="dailySlice__controls">
          <label className="dailySlice__row">
            Zoom
            <input
              type="range"
              min={-25}
              max={25}
              defaultValue={0}
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={!isReady}
            />
          </label>

          <label className="dailySlice__row">
            Layout
            <select
              onChange={(e) => setLayout(Number(e.target.value))}
              disabled={!isReady}
            >
              <option value={2}>Horizontal</option>
              <option value={4}>Vertical</option>
              <option value={5}>Paged</option>
            </select>
          </label>

          <label className="dailySlice__row">
            Transpose
            <input
              type="number"
              min={-12}
              max={12}
              step={1}
              defaultValue={0}
              onChange={(e) => transpose(Number(e.target.value))}
              disabled={!isReady}
              style={{ width: 70 }}
            />
          </label>

          <label className="dailySlice__row">
            Visualization
            <select
              onChange={(e) => setViz(Number(e.target.value))}
              disabled={!isReady}
            >
              <option value={0}>None</option>
              <option value={1}>Piano</option>
              <option value={2}>Fretboard</option>
              <option value={3}>Violin</option>
              <option value={4}>Waveform</option>
              <option value={5}>Mixer</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

function formatTime(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(s / 60);
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
}
