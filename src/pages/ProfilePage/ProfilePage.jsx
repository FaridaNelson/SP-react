import { useState } from "react";
import "./ProfilePage.css";

import Modal from "../../components/Modal/Modal";
import ProfileReminders from "../../components/ProfileReminders/ProfileReminders";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import ProfileAssignments from "../../components/ProfileAssignments/ProfileAssignments";
import ProfileToolbar from "../../components/ProfileToolbar/ProfileToolbar";
import { CURRENT_ASSIGNMENT, HISTORY, TOOLS } from "../../constants/profile";

export default function ProfilePage({ user }) {
  const [showReminders, setShowReminders] = useState(true);
  const [active, setActive] = useState(null);

  return (
    <main className="profile" aria-labelledby="profile-title">
      <div className="container">
        <h1 id="profile-title" className="profile__title">
          Profile
        </h1>

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
            onSelect={(title, source) => setActive({ title, source })}
          />
          <ProfileAssignments
            title="Your Current Assignment"
            items={CURRENT_ASSIGNMENT}
            onOpen={(title) => setActive({ title, source: "current" })}
          />
        </div>
      </div>

      <div className="profile__toolbar-spacer" aria-hidden="true" />
      {/* Sticky Tools on the mobile */}
      <ProfileToolbar
        tools={TOOLS}
        onPick={(title) => setActive({ title, source: "tool" })}
      />

      {/* Shared modal for all items */}
      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? active.title : ""}
      >
        <div className="profile__modal-body">
          {active?.title === "Daily Sight-Reading" ? (
            <DailySightReadingSlice />
          ) : (
            <div>
              <p>
                <strong>Section:</strong> {active?.source}
              </p>
              <p>
                TODO: populate this popup with details for
                <em>{active?.title}</em>.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
