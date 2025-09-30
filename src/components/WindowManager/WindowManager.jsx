import { useMemo, useState } from "react";
import ToolWindow from "../ToolWindow/ToolWindow.jsx";

function useZStack() {
  const [stack, setStack] = useState([]); // array of ids in z order, last = top
  const focus = (id) => setStack((s) => [...s.filter((x) => x !== id), id]);
  const zIndexFor = (id, base = 1000) => base + stack.indexOf(id) + 1;
  return { focus, zIndexFor, stack, setStack };
}

export default function WindowManager({
  windows, // [{ id, title, render, initialMin=false }]
  onCloseWindow, // (id)=>void
}) {
  const { focus, zIndexFor } = useZStack();

  const [minimized, setMinimized] = useState(() =>
    Object.fromEntries(windows.map((w) => [w.id, w.initialMin || false]))
  );

  // Keep a fast lookup
  const minimap = minimized;

  const toggleMin = (id) => setMinimized((m) => ({ ...m, [id]: !m[id] }));

  // Memoize stable list
  const list = useMemo(() => windows, [windows]);

  return (
    <>
      {list.map(({ id, title, render }) => (
        <ToolWindow
          key={id}
          id={id}
          title={title}
          isMinimized={!!minimap[id]}
          onMinimize={() => toggleMin(id)}
          onClose={() => onCloseWindow?.(id)}
          onFocus={() => focus(id)}
          zIndex={zIndexFor(id)}
        >
          {render?.()}
        </ToolWindow>
      ))}
    </>
  );
}
