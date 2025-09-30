import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { createPortal } from "react-dom";
import "./ToolWindow.css";

const DEFAULT = { x: 120, y: 120, width: 320, height: 280 };

function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  const set = (next) => {
    setValue((prev) => {
      const v = typeof next === "function" ? next(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {}
      return v;
    });
  };

  return [value, set];
}

export default function ToolWindow({
  id, // unique id e.g. "metronome" | "timer"
  title,
  children,
  isMinimized = false,
  onMinimize,
  onClose,
  onFocus, // bring to front
  zIndex = 1000,
  bounds = "window", // keep inside viewport
}) {
  const [frame, setFrame] = useLocalState(`toolwin:${id}:frame`, DEFAULT);
  const nodeRef = useRef(null);

  // Keep window fully on-screen if viewport gets smaller
  useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setFrame((prev) => {
        const w = Math.min(prev.width, vw - 16);
        const h = Math.min(prev.height, vh - 16);
        const x = Math.min(Math.max(prev.x, 8), vw - w - 8);
        const y = Math.min(Math.max(prev.y, 8), vh - h - 8);
        return { ...prev, x, y, width: w, height: h };
      });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [setFrame]);

  const headerId = `${id}-title`;

  const content = (
    <Rnd
      ref={nodeRef}
      bounds={bounds}
      dragHandleClassName="toolwin__header"
      size={{ width: frame.width, height: frame.height }}
      position={{ x: frame.x, y: frame.y }}
      onDragStart={onFocus}
      onResizeStart={onFocus}
      onDragStop={(_, data) =>
        setFrame((p) => ({ ...p, x: data.x, y: data.y }))
      }
      onResizeStop={(_, __, ref, _delta, pos) =>
        setFrame({
          x: pos.x,
          y: pos.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }
      style={{ zIndex, position: "fixed" }}
      minWidth={260}
      minHeight={140}
      enableUserSelectHack={false} // keep rest of page selectable
    >
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby={headerId}
        className={`toolwin ${isMinimized ? "toolwin--min" : ""}`}
        onMouseDown={onFocus}
      >
        <header className="toolwin__header" id={headerId}>
          <div className="toolwin__title">{title}</div>
          <div className="toolwin__actions">
            <button
              className="toolwin__btn"
              aria-label={isMinimized ? "Restore" : "Minimize"}
              onClick={onMinimize}
            >
              {isMinimized ? "▣" : "—"}
            </button>
            <button
              className="toolwin__btn toolwin__btn--danger"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </header>

        {!isMinimized && <div className="toolwin__content">{children}</div>}
      </section>
    </Rnd>
  );

  return createPortal(content, document.body);
}
