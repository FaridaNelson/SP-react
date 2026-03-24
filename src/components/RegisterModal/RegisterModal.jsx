import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import PasswordInput from "../PasswordInput/PasswordInput";
import "./RegisterModal.css";

const STUDENT_INSTRUMENTS = ["Piano", "Voice", "Guitar"];
const TEACHER_INSTRUMENTS = ["Piano", "Voice", "Guitar"];
const YEARS_TEACHING_OPTIONS = ["0-2", "3-5", "6-10", "10+"];

export default function RegisterModal({
  open,
  onClose,
  onSwitch,
  onSubmit,
  initialRole,
}) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("studentParent");
  const [role, setRole] = useState(initialRole ?? null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    instrument: "",
    studioName: "",
    yearsTeaching: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [instrumentsTaught, setInstrumentsTaught] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;

    const nextRole = initialRole ?? null;
    setRole(nextRole);

    if (nextRole === "teacher") {
      setActiveTab("teacher");
    } else {
      setActiveTab("studentParent");
    }

    setErr("");
  }, [initialRole, open]);

  useEffect(() => {
    if (!open) {
      setActiveTab("studentParent");
      setRole(initialRole ?? null);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        instrument: "",
        studioName: "",
        yearsTeaching: "",
      });
      setConfirmPassword("");
      setConfirmTouched(false);
      setStudentId("");
      setInstrumentsTaught([]);
      setAcceptedTerms(false);
      setErr("");
      setBusy(false);
    }
  }, [open, initialRole]);

  const title = useMemo(() => {
    return activeTab === "teacher"
      ? "Create your teacher account"
      : "Create your account";
  }, [activeTab]);

  const subtitle = useMemo(() => {
    return activeTab === "teacher"
      ? "Join StudioPulse and start managing your students"
      : "Join StudioPulse and start your musical journey";
  }, [activeTab]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setErr("");

    if (tab === "teacher") {
      setRole("teacher");
    } else if (role === "teacher") {
      setRole(initialRole === "parent" ? "parent" : "student");
    }
  }

  function toggleInstrumentTaught(instrument) {
    setInstrumentsTaught((prev) =>
      prev.includes(instrument)
        ? prev.filter((item) => item !== instrument)
        : [...prev, instrument],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!role) {
      setErr("Please choose a role first.");
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setErr("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }

    if (confirmPassword !== password) {
      setConfirmTouched(true);
      setErr("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setErr("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    if (role === "student") {
      if (!form.instrument) {
        setErr("Please select an instrument.");
        return;
      }
      payload.instrument = form.instrument;
    }

    if (role === "parent") {
      const raw = studentId.trim();
      if (!raw) {
        setErr("Please enter the Student ID or Invite Code.");
        return;
      }

      const isObjectId = (s) => /^[a-f\d]{24}$/i.test(String(s || "").trim());
      payload.studentId = isObjectId(raw) ? raw : raw.toUpperCase();
    }

    if (role === "teacher") {
      if (!form.studioName.trim()) {
        setErr("Please enter your studio or organization name.");
        return;
      }

      if (instrumentsTaught.length === 0) {
        setErr("Please select at least one instrument you teach.");
        return;
      }

      if (!form.yearsTeaching) {
        setErr("Please select your years teaching range.");
        return;
      }

      payload.studioName = form.studioName.trim();
      payload.instrumentsTaught = instrumentsTaught;
      payload.yearsTeaching = form.yearsTeaching;
    }

    setBusy(true);
    try {
      await onSubmit?.(payload);
    } catch (e) {
      setErr(e?.message || "Failed to create account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} variant="auth" title="">
      <div className="registerModal">
        <div className="registerModal__card">
          <header className="registerModal__header">
            <h2 className="registerModal__title">{title}</h2>
            <p className="registerModal__subtitle">{subtitle}</p>
          </header>

          <div
            className="registerModal__tabs"
            role="tablist"
            aria-label="Sign up type"
          >
            <button
              type="button"
              className={`registerModal__tab ${
                activeTab === "studentParent"
                  ? "registerModal__tab--active"
                  : ""
              }`}
              onClick={() => handleTabChange("studentParent")}
            >
              Student / Parent
            </button>

            <button
              type="button"
              className={`registerModal__tab ${
                activeTab === "teacher" ? "registerModal__tab--active" : ""
              }`}
              onClick={() => handleTabChange("teacher")}
            >
              Teacher
            </button>
          </div>

          {activeTab === "teacher" ? (
            <form
              className="registerModal__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="registerModal__infoBox">
                <div className="registerModal__infoTitle">
                  Teacher Registration
                </div>
                <div className="registerModal__infoText">
                  Create your teacher account and complete your professional
                  profile.
                </div>
              </div>

              <div className="registerModal__row">
                <label className="registerModal__group">
                  <span className="registerModal__label">First Name</span>
                  <input
                    className="registerModal__input"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    disabled={busy}
                    required
                  />
                </label>

                <label className="registerModal__group">
                  <span className="registerModal__label">Last Name</span>
                  <input
                    className="registerModal__input"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    disabled={busy}
                    required
                  />
                </label>
              </div>

              <label className="registerModal__group">
                <span className="registerModal__label">Professional Email</span>
                <input
                  className="registerModal__input"
                  type="email"
                  placeholder="teacher@studio.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={busy}
                  required
                />
              </label>

              <div className="registerModal__group">
                <span className="registerModal__label">Password</span>
                <PasswordInput
                  className="registerModal__input"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  disabled={busy}
                  required
                />
                <span className="registerModal__helper">
                  At least 8 characters
                </span>
              </div>

              <div className="registerModal__group">
                <span className="registerModal__label">Confirm password</span>
                <PasswordInput
                  className="registerModal__input"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmTouched(true)}
                  disabled={busy}
                  required
                />
                {confirmTouched && confirmPassword && confirmPassword !== form.password && (
                  <span className="registerModal__mismatch">
                    Passwords do not match
                  </span>
                )}
              </div>

              <label className="registerModal__group">
                <span className="registerModal__label">
                  Studio / Organization
                </span>
                <input
                  className="registerModal__input"
                  type="text"
                  placeholder="Your studio name"
                  value={form.studioName}
                  onChange={(e) => updateField("studioName", e.target.value)}
                  disabled={busy}
                  required
                />
              </label>

              <div className="registerModal__group">
                <span className="registerModal__label">
                  Instruments You Teach
                </span>
                <div className="registerModal__checkboxGroup">
                  {TEACHER_INSTRUMENTS.map((instrument) => (
                    <label
                      key={instrument}
                      className="registerModal__checkboxLabel registerModal__checkboxLabel--compact"
                    >
                      <input
                        type="checkbox"
                        checked={instrumentsTaught.includes(instrument)}
                        onChange={() => toggleInstrumentTaught(instrument)}
                        disabled={busy}
                      />
                      <span>{instrument}</span>
                    </label>
                  ))}
                </div>
                <span className="registerModal__helper">
                  Select all that apply
                </span>
              </div>

              <label className="registerModal__group">
                <span className="registerModal__label">Years Teaching</span>
                <select
                  className="registerModal__select"
                  value={form.yearsTeaching}
                  onChange={(e) => updateField("yearsTeaching", e.target.value)}
                  disabled={busy}
                  required
                >
                  <option value="">Select range</option>
                  {YEARS_TEACHING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} years
                    </option>
                  ))}
                </select>
              </label>

              <label className="registerModal__checkboxLabel">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={busy}
                  required
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    className="registerModal__inlineLink"
                    onClick={() => {
                      onClose?.();
                      navigate("/terms-of-service");
                    }}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="registerModal__inlineLink"
                    onClick={() => {
                      onClose?.();
                      navigate("/privacy-policy");
                    }}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {err && <p className="registerModal__error">{err}</p>}

              <button
                type="submit"
                className="registerModal__submit"
                disabled={busy}
              >
                {busy ? "Creating account..." : "Create account"}
              </button>
            </form>
          ) : (
            <form
              className="registerModal__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="registerModal__row">
                <label className="registerModal__group">
                  <span className="registerModal__label">First Name</span>
                  <input
                    className="registerModal__input"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    disabled={busy}
                    required
                  />
                </label>

                <label className="registerModal__group">
                  <span className="registerModal__label">Last Name</span>
                  <input
                    className="registerModal__input"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    disabled={busy}
                    required
                  />
                </label>
              </div>

              <label className="registerModal__group">
                <span className="registerModal__label">Email Address</span>
                <input
                  className="registerModal__input"
                  type="email"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={busy}
                  required
                />
              </label>

              <div className="registerModal__group">
                <span className="registerModal__label">Password</span>
                <PasswordInput
                  className="registerModal__input"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  disabled={busy}
                  required
                />
                <span className="registerModal__helper">
                  At least 8 characters
                </span>
              </div>

              <div className="registerModal__group">
                <span className="registerModal__label">Confirm password</span>
                <PasswordInput
                  className="registerModal__input"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmTouched(true)}
                  disabled={busy}
                  required
                />
                {confirmTouched && confirmPassword && confirmPassword !== form.password && (
                  <span className="registerModal__mismatch">
                    Passwords do not match
                  </span>
                )}
              </div>

              <div className="registerModal__row">
                <div className="registerModal__group">
                  <span className="registerModal__label">I am a</span>
                  <select
                    className="registerModal__select"
                    value={role && role !== "teacher" ? role : ""}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={busy}
                    required
                  >
                    <option value="">Select role</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>

                <div className="registerModal__group">
                  <span className="registerModal__label">
                    {role === "student" ? "Instrument" : "Account Type"}
                  </span>

                  {role === "student" ? (
                    <select
                      className="registerModal__select"
                      value={form.instrument}
                      onChange={(e) =>
                        updateField("instrument", e.target.value)
                      }
                      disabled={busy}
                      required
                    >
                      <option value="">Select instrument</option>
                      {STUDENT_INSTRUMENTS.map((instrument) => (
                        <option key={instrument} value={instrument}>
                          {instrument}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="registerModal__placeholderBox">
                      {role === "parent"
                        ? "Parent account"
                        : "Choose role first"}
                    </div>
                  )}
                </div>
              </div>

              {role === "parent" && (
                <label className="registerModal__group">
                  <span className="registerModal__label">
                    Student ID or Invite Code
                  </span>
                  <input
                    className="registerModal__input"
                    type="text"
                    placeholder="Enter student ID or invite code"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    disabled={busy}
                    required
                  />
                  <span className="registerModal__helper">
                    Ask the teacher for the student&apos;s invite code.
                  </span>
                </label>
              )}

              <label className="registerModal__checkboxLabel">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={busy}
                  required
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    className="registerModal__inlineLink"
                    onClick={() => {
                      onClose?.();
                      navigate("/terms-of-service");
                    }}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="registerModal__inlineLink"
                    onClick={() => {
                      onClose?.();
                      navigate("/privacy-policy");
                    }}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {err && <p className="registerModal__error">{err}</p>}

              <button
                type="submit"
                className="registerModal__submit"
                disabled={busy || !role}
              >
                {busy ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          <footer className="registerModal__footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="registerModal__footerLink"
              onClick={onSwitch}
              disabled={busy}
            >
              Sign in
            </button>
          </footer>
        </div>
      </div>
    </Modal>
  );
}
