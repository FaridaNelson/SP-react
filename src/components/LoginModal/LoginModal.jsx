import { useEffect, useMemo, useState } from "react";
import Modal from "../Modal/Modal";
import "./LoginModal.css";

export default function LoginModal({ open, onClose, onSwitch, onSubmit }) {
  const [activeTab, setActiveTab] = useState("studentParent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setActiveTab("studentParent");
      setEmail("");
      setPassword("");
      setRememberMe(true);
      setBusy(false);
      setError("");
    }
  }, [open]);

  const title = useMemo(() => {
    return activeTab === "teacher" ? "Teacher sign in" : "Welcome back";
  }, [activeTab]);

  const subtitle = useMemo(() => {
    return activeTab === "teacher"
      ? "Sign in to access your teaching dashboard"
      : "Sign in to continue your learning journey";
  }, [activeTab]);

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      await onSubmit?.({
        email: email.trim().toLowerCase(),
        password,
        userType: activeTab,
        rememberMe,
      });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="" variant="auth">
      <div className="loginModal">
        <div className="loginModal__card">
          <header className="loginModal__header">
            <h2 className="loginModal__title">{title}</h2>
            <p className="loginModal__subtitle">{subtitle}</p>
          </header>

          <div
            className="loginModal__tabs"
            role="tablist"
            aria-label="Sign in type"
          >
            <button
              type="button"
              className={`loginModal__tab ${
                activeTab === "studentParent" ? "loginModal__tab--active" : ""
              }`}
              onClick={() => setActiveTab("studentParent")}
            >
              Student / Parent
            </button>

            <button
              type="button"
              className={`loginModal__tab ${
                activeTab === "teacher" ? "loginModal__tab--active" : ""
              }`}
              onClick={() => setActiveTab("teacher")}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={submit} className="loginModal__form" noValidate>
            <label className="loginModal__group">
              <span className="loginModal__label">Email address</span>
              <input
                className="loginModal__input"
                type="email"
                name="email"
                placeholder={
                  activeTab === "teacher"
                    ? "teacher@studiopulse.co"
                    : "your.email@example.com"
                }
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                required
              />
            </label>

            <label className="loginModal__group">
              <span className="loginModal__label">Password</span>
              <input
                className="loginModal__input"
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
            </label>

            <div className="loginModal__helperRow">
              <label className="loginModal__checkboxLabel">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={busy}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="loginModal__linkButton"
                disabled
                title="Forgot password is not implemented yet"
              >
                Forgot password?
              </button>
            </div>

            {error && <p className="loginModal__error">{error}</p>}

            <button
              type="submit"
              className="loginModal__submit"
              disabled={busy}
            >
              {busy
                ? "Logging in..."
                : activeTab === "teacher"
                  ? "Sign in"
                  : "Sign in"}
            </button>
          </form>

          <footer className="loginModal__footer">
            <span>Don&apos;t have an account?</span>
            <button
              type="button"
              className="loginModal__footerLink"
              onClick={onSwitch}
              disabled={busy}
            >
              Create account
            </button>
          </footer>
        </div>
      </div>
    </Modal>
  );
}
