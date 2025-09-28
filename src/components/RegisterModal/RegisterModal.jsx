import { useState } from "react";
import Modal from "../Modal/Modal";

export default function RegisterModal({ open, onClose, onSwitch, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Register submit fired");

    setErr("");
    setBusy(true);
    try {
      await onSubmit?.(form);
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return open ? (
    <Modal open={open} onClose={onClose} title="Sign Up">
      <form onSubmit={handleSubmit} className="authForm" noValidate>
        <label className="label">Please, enter your information below:</label>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="User Name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
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
        />

        {err && <p className="error">{err}</p>}

        <div className="modal__actions">
          <button
            type="button"
            className="btn-submit"
            disabled={busy}
            onClick={(e) => handleSubmit(e)}
          >
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
  ) : null;
}
