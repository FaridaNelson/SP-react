import { useState } from "react";
import Modal from "../Modal/Modal";
import "./LoginModal.css";

export default function LoginModal({ open, onClose, onSwitch, onSubmit }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email")?.toString().trim();
    const password = fd.get("password")?.toString();

    setError("");
    setBusy(true);
    try {
      await onSubmit?.({ email, password });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Log In">
      <form onSubmit={submit} className="authForm" noValidate>
        <label className="label">
          Please, enter your login information below:
        </label>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />

        {error && <p className="error">{error}</p>}

        <div className="modal__actions">
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? "Logging in..." : "Log In"}
          </button>
          <p className="help"></p>
          Don&apos;t have an account?
          <button
            type="button"
            className="btn-submit btn-switch"
            onClick={onSwitch}
            disabled={busy}
          >
            Sign Up
          </button>
        </div>
      </form>
    </Modal>
  );
}
