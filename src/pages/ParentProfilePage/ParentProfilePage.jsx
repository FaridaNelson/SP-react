import { useState } from "react";
import "./ParentProfilePage.css";

import { useParentData }    from "./hooks/useParentData";
import TopBar               from "./components/TopBar";
import BottomNav            from "./components/BottomNav";
import SnapshotSection      from "./views/SnapshotSection";
import ProgressSection      from "./views/ProgressSection";
import PracticeSection      from "./views/PracticeSection";
import ProfileView          from "./views/ProfileView";

export default function ParentProfilePage({ currentUser, onSignOut }) {
  const [activeSection, setActiveSection] = useState("snapshot");
  const [showProfile,   setShowProfile]   = useState(false);

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

  // ── No student linked ───────────────────────────────────────────
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

  // ── Loading ─────────────────────────────────────────────────────
  if (loadingStudents) {
    return (
      <div className="pd-root">
        <div className="pd-loading">Loading…</div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────
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
          <div className="pd-content">
            {error && (
              <div className="pd-error">
                Something went wrong loading data. Please refresh.
              </div>
            )}

            {loadingItems ? (
              <div className="pd-loading">Loading…</div>
            ) : (
              <>
                {activeSection === "snapshot" && (
                  <SnapshotSection
                    student={selectedStudent}
                    cycle={cycle}
                    items={items}
                  />
                )}

                {activeSection === "progress" && (
                  <ProgressSection studentId={selectedId} />
                )}

                {activeSection === "practice" && (
                  <PracticeSection
                    studentName={selectedStudent?.firstName ?? "your child"}
                    examType={cycle?.examType}
                  />
                )}

                {activeSection === "detailed" && (
                  <div className="pd-card pd-card--pad">
                    <div className="pd-coming-soon">
                      <div className="pd-coming-soon-icon" aria-hidden="true">♩</div>
                      <div className="pd-coming-soon-text">Pieces overview coming soon…</div>
                    </div>
                  </div>
                )}

                {activeSection === "exams" && (
                  <div className="pd-card pd-card--pad">
                    <div className="pd-coming-soon">
                      <div className="pd-coming-soon-icon" aria-hidden="true">◎</div>
                      <div className="pd-coming-soon-text">Exam management coming soon…</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <BottomNav active={activeSection} onChange={setActiveSection} />
        </>
      )}
    </div>
  );
}
