import { useState, useCallback, useEffect, useRef } from "react";
import "./ParentProfilePage.css";

import { useParentData } from "./hooks/useParentData";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import SnapshotSection from "./views/SnapshotSection";
import ProgressSection from "./views/ProgressSection";
import PracticeSection from "./views/PracticeSection";
import ProfileView from "./views/ProfileView";
import DetailedSection from "./views/DetailedSection";
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
  const practiceSaveRef = useRef(null);
  const prevSectionRef = useRef(activeSection);

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
    refetchStudents,
  } = useParentData();

  // Keep ref in sync so scroll handler never reads stale state
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Save practice log when navigating away from the practice pane
  useEffect(() => {
    if (prevSectionRef.current === "practice" && activeSection !== "practice") {
      practiceSaveRef.current?.();
    }
    prevSectionRef.current = activeSection;
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

  // ── Sync nav with manual swipes (document-level touch handler) ─
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      const currentIndex = NAV_ORDER.indexOf(activeSectionRef.current);
      if (dx < 0 && currentIndex < NAV_ORDER.length - 1) {
        navigateTo(NAV_ORDER[currentIndex + 1]);
      } else if (dx > 0 && currentIndex > 0) {
        navigateTo(NAV_ORDER[currentIndex - 1]);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [navigateTo]);

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
        onStudentLinked={() => refetchStudents()}
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
                studentId={selectedId}
                cycle={cycle}
                saveRef={practiceSaveRef}
              />
            </div>

            {/* 4 — Detailed */}
            <div className="pd-view-pane">
              <DetailedSection studentId={selectedId} cycle={cycle} />
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
