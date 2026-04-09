import { useState } from "react";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { getInitials } from "../lib/parentUtils";
import "./ProfileView.css";

export default function ProfileView({ user, onBack, onSignOut }) {
  console.log("[ProfileView] onSignOut:", typeof onSignOut, onSignOut);

  const [showSignOutModal, setShowSignOutModal] = useState(false);

  return (
    <div className="pd-profile">
      <button className="pd-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="pd-profile-header">
        <div className="pd-parent-avatar pd-parent-avatar--lg">
          {getInitials(user?.name ?? "Parent")}
        </div>
        <div className="pd-profile-name">{user?.name ?? "Parent"}</div>
        <div className="pd-profile-email">{user?.email ?? ""}</div>
      </div>

      <div className="pd-settings-section">
        <div className="pd-settings-title">Account Settings</div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Email</span>
          <span className="pd-settings-value">{user?.email ?? "—"}</span>
        </div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Phone</span>
          <span className="pd-settings-value">{user?.phone || "Not set"}</span>
        </div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Password</span>
          <span className="pd-settings-value">••••••••</span>
        </div>
      </div>

      <div className="pd-settings-section">
        <div className="pd-settings-title">Preferences</div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Email Notifications</span>
          <span className="pd-settings-value">Enabled</span>
        </div>
        <div className="pd-settings-item">
          <span className="pd-settings-label">Language</span>
          <span className="pd-settings-value">English</span>
        </div>
      </div>

      <button
        className="pd-signout-btn"
        onClick={() => setShowSignOutModal(true)}
      >
        Sign Out
      </button>

      <ConfirmationModal
        isOpen={showSignOutModal}
        title="Sign Out"
        message={
          "Are you sure you want to sign out?\nYour progress is saved automatically."
        }
        confirmText="Sign out"
        cancelText="Stay signed in"
        onConfirm={onSignOut}
        onCancel={() => setShowSignOutModal(false)}
      />
    </div>
  );
}
