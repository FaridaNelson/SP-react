import { lazy } from "react";

//lazy = code-splitting; loads tool UI only when needed
export const TOOL_COMPONENTS = {
  metronome: lazy(() => import("../components/Metronome/Metronome.jsx")),
  timer: lazy(() => import("../components/Timer/Timer.jsx")),
  calendar: lazy(() => import("../components/CalendarMini/CalendarMini.jsx")),
};

export function getToolComponent(key) {
  return TOOL_COMPONENTS[key] || null;
}
