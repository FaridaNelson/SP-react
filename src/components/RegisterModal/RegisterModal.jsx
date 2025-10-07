import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

export default function RegisterModal({
  open,
  onClose,
  onSwitch,
  onSubmit, // calls App.handleRegister
  initialRole,
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // IMPORTANT: do NOT silently default to "student"
  // Let role be null until RoleSelectModal sets it, or user picks below.
  const [role, setRole] = useState(initialRole ?? null);

  const [studentId, setStudentId] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setRole(initialRole ?? null);
  }, [initialRole, open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!role) {
      setErr("Please choose a role first.");
      return;
    }

    let payload = { ...form, role };

    if (role === "parent") {
      const raw = (studentId || "").trim();
      if (!raw) {
        setErr("Please enter the Student ID or Invite Code.");
        return;
      }
      const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s || "").trim());
      payload.studentId = isObjectId ? raw : raw.toUpperCase();
    }

    setBusy(true);
    try {
      await onSubmit?.(payload);
    } catch (e) {
      setErr(e.message || "Failed to create account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Sign Up">
      <form onSubmit={handleSubmit} className="authForm" noValidate>
        <label className="label">Please, enter your information below:</label>

        {/* --- optional inline role safety (in case user reached here w/o RoleSelect) --- */}
        {!role && (
          <div className="role-guard" style={{ marginBottom: 12 }}>
            <p className="help" style={{ marginBottom: 8 }}>
              Choose your role:
            </p>
            <div className="role-choices" style={{ display: "flex", gap: 8 }}>
              {["student", "parent", "teacher"].map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={busy}
                  className={`btn-chip${role === r ? " is-active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r[0].toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        {role && (
          <p className="help" style={{ marginBottom: 8 }}>
            Signing up as <strong>{role}</strong>
          </p>
        )}
        {/* --- end optional role guard --- */}

        <input
          className="input"
          type="text"
          name="name"
          placeholder="User Name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          disabled={busy}
        />

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          disabled={busy}
        />

        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          disabled={busy}
        />

        {role === "parent" && (
          <input
            className="input"
            type="text"
            name="studentId"
            placeholder="Student ID or Invite Code"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            disabled={busy}
          />
        )}

        {err && <p className="error">{err}</p>}

        <div className="modal__actions">
          {/* Use a real submit button */}
          <button type="submit" className="btn-submit" disabled={busy || !role}>
            {busy ? "Creating..." : "Create Account"}
          </button>

          <p className="help">Already have an account? </p>
          <button
            type="button"
            className="btn-submit btn-switch"
            onClick={onSwitch}
            disabled={busy}
          >
            Log in
          </button>
        </div>
      </form>
    </Modal>
  );
}
