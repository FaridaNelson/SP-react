import { useState, useMemo, Suspense } from "react";
import { getToolComponent } from "../../registry/tools.js";
import DailySightReadingSlice from "../../components/DailySightReadingSlice/DailySightReadingSlice";
import WindowManager from "../../components/WindowManager/WindowManager.jsx";
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

  const [openWins, setOpenWins] = useState([]);
  const addWin = (key) =>
    setOpenWins((s) => (s.includes(key) ? s : [...s, key]));
  const closeWin = (key) => setOpenWins((s) => s.filter((x) => x !== key));

  const handleSidebarSelect = (item, source) =>
    setActive({ key: item.key, title: item.title, source });

  const handleOpenAssignment = (item) =>
    setActive({ key: item.key, title: item.title, source: "current" });

  const handlePickTool = (tool) => addWin(tool.key);

  const windows = useMemo(() => {
    return openWins.map((id) => {
      const Comp = getToolComponent(id);
      return {
        id,
        title:
          TOOLS.find((t) => t.key === id)?.title ??
          id.charAt(0).toUpperCase() + id.slice(1),
        render: () =>
          Comp ? (
            <Suspense fallback={<p>Loading {id}...</p>}>
              <Comp />
            </Suspense>
          ) : (
            <p>Unknown tool.</p>
          ),
      };
    });
  }, [openWins]);

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

      <ProfileToolbar tools={TOOLS} onPick={handlePickTool} />

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
            <DailySightReadingSlice
              sliceId="r7RTc"
              useApi={false}
              showControls={false}
              meta={{
                title: "Slice Title",
                artist: "ABRSM",
                description: "ABRSM Piano Sight Reading",
              }}
            />
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
      </Modal>

      <WindowManager windows={windows} onCloseWindow={closeWin} />
    </main>
  );
}
