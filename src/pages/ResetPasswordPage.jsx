import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import { api } from "../lib/api.js";
import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="resetPage">
        <div className="resetPage__card">
          <h2 className="resetPage__title">Invalid reset link</h2>
          <p className="resetPage__subtitle">
            This password reset link is invalid or has already been used.
          </p>
          <Link
            to="/"
            state={{ openAuth: "signin" }}
            className="resetPage__backLink"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="resetPage">
        <div className="resetPage__card">
          <h2 className="resetPage__title">Password updated</h2>
          <p className="resetPage__subtitle">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
          <button
            type="button"
            className="resetPage__submit"
            onClick={() => navigate("/", { state: { openAuth: "signin" } })}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: { token, newPassword },
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="resetPage">
      <div className="resetPage__card">
        <header className="resetPage__header">
          <h2 className="resetPage__title">Reset your password</h2>
          <p className="resetPage__subtitle">Enter your new password below.</p>
        </header>

        <form onSubmit={handleSubmit} className="resetPage__form" noValidate>
          <label className="resetPage__group">
            <span className="resetPage__label">New password</span>
            <PasswordInput
              className="resetPage__input"
              name="newPassword"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          <label className="resetPage__group">
            <span className="resetPage__label">Confirm password</span>
            <PasswordInput
              className="resetPage__input"
              name="confirmPassword"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          {error && <p className="resetPage__error">{error}</p>}

          <button
            type="submit"
            className="resetPage__submit"
            disabled={busy}
          >
            {busy ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <footer className="resetPage__footer">
          <Link
            to="/"
            state={{ openAuth: "signin" }}
            className="resetPage__backLink"
          >
            Back to Sign In
          </Link>
        </footer>
      </div>
    </div>
  );
}
