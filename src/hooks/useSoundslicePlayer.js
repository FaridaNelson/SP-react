import { useCallback, useEffect, useRef, useState } from "react";

const SS_ORIGIN = "https://www.soundslice.com";

/**
 * useSoundslicePlayer
 * - Use with a full embed iframe whose src ends in `/embed/?api=1`
 * - Gives controls, state, a `request()` Promise API for getters, and `on()` subscriptions
 */

export function useSoundslicePlayer(
  iframeRef,
  { origin = SS_ORIGIN, debug = false } = {}
) {
  // basic derived state (best-effort from events)
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tempo, setTempoState] = useState(null);
  const [zoom, setZoomState] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  // listeners registry (by event/method name)
  const listenersRef = useRef(new Map());
  const onceRef = useRef(new Map());
  const readyOnce = useRef(false);

  // postMessage sender
  const send = useCallback(
    (method, arg) => {
      const win = iframeRef?.current?.contentWindow;
      if (!win) return;
      const payload = arg === undefined ? { method } : { method, arg };
      if (debug) console.log("[SS →]", payload);
      win.postMessage(JSON.stringify(payload), origin);
    },
    [iframeRef, origin, debug]
  );

  // subscribe / unsubscribe
  const on = useCallback((method, handler) => {
    const map = listenersRef.current;
    const arr = map.get(method) || [];
    map.set(method, [...arr, handler]);
    return () =>
      map.set(
        method,
        (map.get(method) || []).filter((h) => h !== handler)
      );
  }, []);

  // Request/response helper for “getter” APIs (returns a Promise)
  // Example: await request("getCurrentTime", "ssCurrentTime")
  const request = useCallback(
    (method, reply) => {
      return new Promise((resolve) => {
        const map = onceRef.current;
        const arr = map.get(reply) || [];
        map.set(reply, [...arr, resolve]);
        send(method);
      });
    },
    [send]
  );

  // convenience controls (wrapping send)
  const play = useCallback(() => send("play"), [send]);
  const pause = useCallback(() => send("pause"), [send]);
  const togglePlay = useCallback(
    () => (isPlaying ? pause() : play()),
    [isPlaying, play, pause]
  );

  const setTimeSec = useCallback(
    (sec) => send("set_time", Math.max(0, Number(sec) || 0)),
    [send]
  );
  const seekBy = useCallback(
    (delta) => setTimeSec(time + Number(delta || 0)),
    [setTimeSec, time]
  );

  const setTempo = useCallback(
    (bpm) => send("set_tempo", Math.max(20, Math.min(300, Number(bpm) || 0))),
    [send]
  );

  // New: notation & layout methods from the docs
  const setZoom = useCallback(
    (z) => send("setZoom", Math.max(-25, Math.min(25, Math.round(z)))),
    [send]
  );
  const setStaveWidth = useCallback(
    (spaces) => send("setStaveWidth", Math.max(10, Math.round(spaces || 0))),
    [send]
  );
  const setLayout = useCallback(
    (layoutCode) => send("setLayout", Number(layoutCode)),
    [send]
  ); // 2=h-scroll,4=v-scroll,5=paged
  const setPagesPerScreen = useCallback(
    (n) => send("setPagesPerScreen", Number(n)),
    [send]
  );
  const setProportionalNotation = useCallback(
    (onOff) => send("setProportionalNotation", !!onOff),
    [send]
  );
  const setProportionalSize = useCallback(
    (n) => send("setProportionalSize", Math.round(n || 0)),
    [send]
  );
  const setNotationVisibility = useCallback(
    (visible) => send("setNotationVisibility", !!visible),
    [send]
  );
  const setTrackVisibility = useCallback(
    ({ type, arg, track }) => {
      const payload = { type: Number(type), arg: Number(arg) };
      if (track !== undefined) payload.track = Number(track);
      send("setTrackVisibility", payload);
    },
    [send]
  );
  const transpose = useCallback(
    (halfSteps) =>
      send("transpose", Math.max(-12, Math.min(12, Math.round(halfSteps)))),
    [send]
  );
  const print = useCallback(() => send("print"), [send]);
  const setViz = useCallback((code) => send("setViz", Number(code)), [send]); // 0 none, 1 piano, 2 fretboard, 3 violin, 4 waveform, 5 mixer

  // getters as Promises via request()
  const getCurrentTime = useCallback(
    () => request("getCurrentTime", "ssCurrentTime"),
    [request]
  );
  const getDuration = useCallback(
    () => request("getDuration", "ssDuration"),
    [request]
  );
  const getCurrentBar = useCallback(
    () => request("getCurrentBar", "ssCurrentBar"),
    [request]
  );
  const getBarCount = useCallback(
    () => request("getBarCount", "ssBarCount"),
    [request]
  );
  const getAudioSources = useCallback(
    () => request("getAudioSources", "ssAudioSources"),
    [request]
  );
  const getSpeed = useCallback(() => request("getSpeed", "ssSpeed"), [request]);
  const getVolume = useCallback(
    () => request("getVolume", "ssVolume"),
    [request]
  );
  const getNotationDimensions = useCallback(
    () => request("getNotationDimensions", "ssNotationDimensions"),
    [request]
  );
  const getNotationVisibility = useCallback(
    () => request("getNotationVisibility", "ssNotationVisibility"),
    [request]
  );
  const getFullscreenSupport = useCallback(
    () => request("getFullscreenSupport", "ssFullscreenSupport"),
    [request]
  );

  // inbound messages -> update state + fan out to listeners
  useEffect(() => {
    function handle(e) {
      if (e.origin !== origin) return;
      let msg = e.data;
      try {
        msg = typeof msg === "string" ? JSON.parse(msg) : msg;
      } catch {
        /* ignore */
      }
      if (debug) console.log("[SS ←]", msg);
      if (!msg || typeof msg !== "object") return;

      setLastMessage(msg);

      // built-in state
      if (
        !readyOnce.current &&
        (msg.method === "ssPlayerReady" || msg.ready === true)
      ) {
        readyOnce.current = true;
        setIsReady(true);
      }
      if (msg.method === "ssPlay") setIsPlaying(true);
      if (msg.method === "ssPause" || msg.method === "ssAudioEnd")
        setIsPlaying(false);
      if (msg.method === "ssCurrentTime" && typeof msg.arg === "number")
        setTime(msg.arg);
      if (msg.method === "ssDuration" && typeof msg.arg === "number")
        setDuration(msg.arg);
      if (msg.method === "ssZoom" && Number.isInteger(msg.arg))
        setZoomState(msg.arg);
      if (msg.method === "ssSpeed" && typeof msg.arg === "number")
        setTempoState(null); // (Speed != tempo; leaving tempo state to set_tempo)

      // once-waiters
      const waiters = onceRef.current.get(msg.method);
      if (waiters?.length) {
        onceRef.current.set(msg.method, []);
        waiters.forEach((fn) => fn(msg.arg));
      }

      // subscribers
      const subs = listenersRef.current.get(msg.method);
      subs?.forEach((fn) => fn(msg));
    }

    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, [origin, debug]);

  return {
    // output
    send,
    on,
    request,

    // transport/state
    isReady,
    isPlaying,
    time,
    duration,
    tempo,
    zoom,
    lastMessage,

    // transport controls
    play,
    pause,
    togglePlay,
    setTime: setTimeSec,
    seekBy,
    setTempo,

    // notation/layout controls
    setZoom,
    setStaveWidth,
    setLayout,
    setPagesPerScreen,
    setProportionalNotation,
    setProportionalSize,
    setNotationVisibility,
    setTrackVisibility,
    transpose,
    print,
    setViz,

    // getters (Promises)
    getCurrentTime,
    getDuration,
    getCurrentBar,
    getBarCount,
    getAudioSources,
    getSpeed,
    getVolume,
    getNotationDimensions,
    getNotationVisibility,
    getFullscreenSupport,
  };
}
