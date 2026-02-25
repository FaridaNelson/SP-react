import { useState, Suspense } from "react";
import "./ProfilePage.css";

import Modal from "../../components/Modal/Modal";
import ProfileReminders from "../../components/ProfileReminders/ProfileReminders";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import ProfileAssignments from "../../components/ProfileAssignments/ProfileAssignments";
import { CURRENT_ASSIGNMENT, HISTORY } from "../../constants/profile";

export default function ProfilePage({ user }) {
  const [showReminders, setShowReminders] = useState(true);
  const [active, setActive] = useState(null);

  const handleSidebarSelect = (item, source) =>
    setActive({ key: item.key, title: item.title, source });

  const handleOpenAssignment = (item) =>
    setActive({ key: item.key, title: item.title, source: "current" });

  return (
    <main className="profile" aria-labelledby="profile-title">
      <div className="container">
        {/* Reminders - replace with real data when hooked up with the backend */}
        {showReminders && (
          <ProfileReminders
            nextLessonLabel="Your Next Lesson is scheduled on: "
            nextLessonTime="Tue, Oct 7, 2025 · 4:30 PM"
            teacherName={user?.name || "Your Teacher"}
            onDismiss={() => setShowReminders(false)}
          />
        )}

        {/* Body */}
        <div className="profile__body">
          <ProfileSidebar
            current={CURRENT_ASSIGNMENT}
            history={HISTORY}
            onSelect={handleSidebarSelect}
          />
          <ProfileAssignments
            title="Your Current Assignment"
            items={CURRENT_ASSIGNMENT}
            onOpen={handleOpenAssignment}
          />
        </div>
      </div>
      <div className="profile__toolbar-spacer" aria-hidden="true" />
      {/* Shared modal for all items */}
      <Modal
        open={!!active && active.source !== "tool"}
        onClose={() => setActive(null)}
        title={active ? active.title : ""}
      >
        <div className="profile__modal-body">
          {active?.source === "tool" ? (
            (() => {
              const Tool = getToolComponent(active.key);
              return Tool ? (
                <Suspense fallback={<p>Loading tool…</p>}>
                  <Tool />
                </Suspense>
              ) : (
                <p>Unknown tool.</p>
              );
            })()
          ) : active?.source === "current" && active.key === "sight-reading" ? (
            <div className="profile__placeholder">
              <h3>Sight Reading</h3>
              <p>
                Sight Reading materials will live inside StudioPulse (no
                third-party embed).
              </p>
              <p>
                Coming next: PDFs, audio demos, and a timer/metronome—all built
                in.
              </p>
            </div>
          ) : (
            // default assignment view
            <div>
              <p>
                <strong>Section:</strong> {active?.source}
              </p>
              <p>
                Details for <em>{active?.title}</em> coming soon.
              </p>
            </div>
          )}
        </div>
      </Modal>{" "}
    </main>
  );
}
