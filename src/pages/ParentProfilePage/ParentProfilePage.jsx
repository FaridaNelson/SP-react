import { useState, useCallback, useEffect, useRef } from "react";
import "./ParentProfilePage.css";

import { useParentData } from "./hooks/useParentData";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import SnapshotSection from "./views/SnapshotSection";
import ProgressSection from "./views/ProgressSection";
import PracticeSection from "./views/PracticeSection";
import ProfileView from "./views/ProfileView";
import ExamsSection from "./views/ExamsSection";

// Must match the order of nav items in BottomNav
const NAV_ORDER = ["snapshot", "progress", "practice", "detailed", "exams"];

export default function ParentProfilePage({ currentUser, onSignOut }) {
  const [activeSection, setActiveSection] = useState("snapshot");
  const [showProfile, setShowProfile] = useState(false);

  // Refs for swipe ↔ nav sync
  const scrollRef = useRef(null);
  const isScrollingRef = useRef(false); // true while programmatic scroll runs
  const activeSectionRef = useRef("snapshot"); // shadow of state for scroll handler

  const {
    students,
    selectedId,
    selectedStudent,
    cycle,
    items,
    loadingStudents,
    loadingItems,
    error,
    selectStudent,
  } = useParentData();

  // Keep ref in sync so scroll handler never reads stale state
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // ── Programmatic navigation (bottom nav taps) ─────────────────
  const navigateTo = useCallback((section) => {
    const index = NAV_ORDER.indexOf(section);
    if (index === -1) return;
    setActiveSection(section);
    activeSectionRef.current = section;
    const container = scrollRef.current;
    if (!container) return;
    isScrollingRef.current = true;
    container.scrollTo({
      left: index * container.offsetWidth,
      behavior: "smooth",
    });
    // Release the lock after the smooth scroll finishes (~400 ms)
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 450);
  }, []);

  // ── Sync nav with manual swipes ───────────────────────────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      if (isScrollingRef.current) return;
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      const section = NAV_ORDER[index];
      if (section && section !== activeSectionRef.current) {
        activeSectionRef.current = section;
        setActiveSection(section);
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []); // runs once — uses refs to avoid stale closures

  // ── No student linked ─────────────────────────────────────────
  if (!loadingStudents && !students.length) {
    return (
      <div className="pd-root">
        <div className="pd-topbar">
          <div className="pd-topbar-logo">
            <span className="pd-topbar-wordmark">
              STUDIO <strong>PULSE</strong>
            </span>
          </div>
        </div>
        <div className="pd-content">
          <div className="pd-empty-state">
            <h1 className="pd-empty-title">Student Progress</h1>
            <p className="pd-empty-body">
              To view progress, link your student ID — ask their teacher.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────
  if (loadingStudents) {
    return (
      <div className="pd-root">
        <div className="pd-loading">Loading…</div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────
  return (
    <div className="pd-root">
      <TopBar
        students={students}
        selectedId={selectedId}
        onSelect={selectStudent}
        onProfileClick={() => setShowProfile(true)}
        user={currentUser}
      />

      {showProfile ? (
        <div className="pd-content">
          <ProfileView
            user={currentUser}
            onBack={() => setShowProfile(false)}
            onSignOut={onSignOut}
          />
        </div>
      ) : (
        <>
          {/* All views rendered side-by-side — swipeable */}
          <div className="pd-views-container" ref={scrollRef}>
            {/* 1 — Snapshot */}
            <div className="pd-view-pane">
              {error && (
                <div className="pd-error">
                  Something went wrong loading data. Please refresh.
                </div>
              )}
              {loadingItems ? (
                <div className="pd-loading">Loading…</div>
              ) : (
                <SnapshotSection
                  student={selectedStudent}
                  cycle={cycle}
                  items={items}
                />
              )}
            </div>

            {/* 2 — Progress */}
            <div className="pd-view-pane">
              <ProgressSection studentId={selectedId} />
            </div>

            {/* 3 — Practice */}
            <div className="pd-view-pane">
              <PracticeSection
                studentName={selectedStudent?.firstName ?? "your child"}
                examType={cycle?.examType}
              />
            </div>

            {/* 4 — Detailed (coming soon) */}
            <div className="pd-view-pane">
              <div className="pd-card pd-card--pad">
                <div className="pd-coming-soon">
                  <div className="pd-coming-soon-icon" aria-hidden="true">
                    ♩
                  </div>
                  <div className="pd-coming-soon-text">
                    Pieces overview coming soon…
                  </div>
                </div>
              </div>
            </div>

            {/* 5 — Exams */}
            <div className="pd-view-pane">
              <ExamsSection studentId={selectedId} />
            </div>
          </div>

          <BottomNav active={activeSection} onChange={navigateTo} />
        </>
      )}
    </div>
  );
}
