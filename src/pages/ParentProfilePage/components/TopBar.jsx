import "./TopBar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../lib/parentUtils";
import { API_BASE } from "../../../lib/api";

export default function TopBar({ students, selectedId, onSelect, onProfileClick, user, onStudentLinked }) {
  const [open,   setOpen]  = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [code, setCode] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const dropRef            = useRef(null);
  const navigate           = useNavigate();
  const selected           = students.find((s) => s._id === selectedId);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLinkStudent() {
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch(`${API_BASE}/api/parent/link-student`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to link student");
      setAddOpen(false);
      setCode("");
      onStudentLinked?.();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="pd-topbar">
      {/* Logo — click navigates to home */}
      <button
        className="pd-topbar-logo"
        onClick={() => navigate("/")}
        aria-label="Go to home page"
      >
        <svg width="32" height="14" viewBox="0 0 38 16" fill="none">
          <line x1="0" y1="8" x2="5" y2="8" stroke="#E8D49A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <polyline
            points="5,8 7.5,8 9,2 11,14 13,4 15,12 17,8 19,8"
            stroke="#E8D49A" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
          <line x1="19" y1="8" x2="38" y2="8" stroke="#E8D49A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
        <span className="pd-topbar-wordmark">
          STUDIO <strong>PULSE</strong>
        </span>
      </button>

      {/* Right controls */}
      <div className="pd-topbar-right">
        {/* Child selector */}
        <div className="pd-child-selector" ref={dropRef}>
          <button className="pd-child-btn" onClick={() => setOpen((o) => !o)}>
            {selected && (
              <span className="pd-child-avatar">{getInitials(selected.name)}</span>
            )}
            <span>{selected?.firstName ?? "Select child"}</span>
            <span className="pd-child-caret">▾</span>
          </button>

          {open && (
            <div className="pd-child-dropdown">
              {students.map((s) => (
                <div
                  key={s._id}
                  className={`pd-dropdown-item${s._id === selectedId ? " pd-dropdown-item--active" : ""}`}
                  onClick={() => { onSelect(s._id); setOpen(false); }}
                >
                  <span className="pd-child-avatar pd-child-avatar--sm">
                    {getInitials(s.name)}
                  </span>
                  <div>
                    <div className="pd-dropdown-name">{s.name}</div>
                    <div className="pd-dropdown-grade">{s.grade ?? ""}</div>
                  </div>
                </div>
              ))}
              <div className="pd-dropdown-divider" />
              <button className="pd-dropdown-add-btn" onClick={() => { setOpen(false); setAddOpen(true); }}>
                + Add a Sibling
              </button>
            </div>
          )}
        </div>

        {/* Parent avatar */}
        <button className="pd-profile-btn" onClick={onProfileClick}>
          <div className="pd-parent-avatar">
            {getInitials(user?.name ?? "P")}
          </div>
        </button>
      </div>

      {addOpen && (
        <div className="pd-add-modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="pd-add-modal" onClick={e => e.stopPropagation()}>
            <div className="pd-add-modal-title">Add a Sibling</div>
            <div className="pd-add-modal-sub">Enter the 8-character invite code from the student's teacher</div>
            <input
              className="pd-add-modal-input"
              maxLength={8}
              placeholder="e.g. AB12CD34"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              autoFocus
            />
            {addError && <div className="pd-add-modal-error">{addError}</div>}
            <div className="pd-add-modal-actions">
              <button className="pd-add-modal-cancel" onClick={() => { setAddOpen(false); setCode(""); setAddError(""); }}>Cancel</button>
              <button className="pd-add-modal-confirm" onClick={handleLinkStudent} disabled={code.length !== 8 || adding}>
                {adding ? "Linking…" : "Link Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
