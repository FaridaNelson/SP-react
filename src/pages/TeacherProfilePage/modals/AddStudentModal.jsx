import { useState } from "react";
import Modal from "../../../components/Modal/Modal";
import "./AddStudentModal.css";

export default function AddStudentModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    studentFirstName: "",
    studentLastName: "",
    studentEmail: "",
    instrument: "",
    grade: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
  });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    setErr("");

    if (!form.studentFirstName || !form.studentLastName) {
      setErr("Student first and last name are required.");
      return;
    }

    if (!form.studentEmail.trim()) {
      setErr("Student email is required.");
      return;
    }

    if (!form.instrument) {
      setErr("Instrument is required.");
      return;
    }

    if (!form.grade) {
      setErr("Grade is required.");
      return;
    }

    setBusy(true);

    const payload = {
      firstName: form.studentFirstName.trim(),
      lastName: form.studentLastName.trim(),
      email: form.studentEmail.trim(),
      instrument: form.instrument,
      grade: Number(form.grade),
      parentContactSnapshot: {
        firstName: form.parentFirstName.trim(),
        lastName: form.parentLastName.trim(),
        email: form.parentEmail.trim(),
        phone: form.parentPhone.trim(),
      },
    };

    try {
      const created = await onSubmit?.(payload);

      setForm({
        studentFirstName: "",
        studentLastName: "",
        studentEmail: "",
        instrument: "",
        grade: "",
        parentFirstName: "",
        parentLastName: "",
        parentEmail: "",
        parentPhone: "",
      });

      onClose?.();
      return created;
    } catch (e) {
      setErr(e?.message || "Failed to add student");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      panelClassName="spModal__panel"
      title={null}
      variant="slideRight"
    >
      <div className="spModal__content">
        <header className="spModal__head">
          <div>
            <h2 className="spModal__title">Add a new student</h2>
          </div>

          <button
            type="button"
            className="spModal__close"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <form className="spModal__form" onSubmit={handleAddStudent}>
          <div className="spModal__scroll">
            <section className="spModal__section">
              <div className="spModal__sectionHead">
                <h3 className="spModal__sectionTitle">Student Information</h3>
              </div>

              <div className="spModal__sectionBody">
                <div className="spModal__grid">
                  <label className="spModal__field">
                    <span className="spModal__label">FIRST NAME</span>
                    <input
                      className="spModal__input"
                      placeholder="e.g., Emma"
                      value={form.studentFirstName}
                      onChange={(e) =>
                        setField("studentFirstName", e.target.value)
                      }
                      required
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">LAST NAME</span>
                    <input
                      className="spModal__input"
                      placeholder="e.g., Johnson"
                      value={form.studentLastName}
                      onChange={(e) =>
                        setField("studentLastName", e.target.value)
                      }
                      required
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">STUDENT EMAIL</span>
                    <input
                      className="spModal__input"
                      type="email"
                      placeholder="emma@email.com"
                      value={form.studentEmail}
                      onChange={(e) => setField("studentEmail", e.target.value)}
                      required
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">INSTRUMENT</span>
                    <select
                      className="spModal__input"
                      value={form.instrument}
                      onChange={(e) => setField("instrument", e.target.value)}
                      required
                      disabled={busy}
                    >
                      <option value="">Select instrument</option>
                      <option value="Piano">Piano</option>
                      <option value="Voice">Voice</option>
                      <option value="Guitar">Guitar</option>
                    </select>
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">GRADE</span>
                    <select
                      className="spModal__input"
                      value={form.grade}
                      onChange={(e) => setField("grade", e.target.value)}
                      required
                      disabled={busy}
                    >
                      <option value="">Select grade</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>

            <section className="spModal__section">
              <div className="spModal__sectionHead">
                <h3 className="spModal__sectionTitle">Parent Information</h3>
              </div>

              <div className="spModal__sectionBody">
                <div className="spModal__grid">
                  <label className="spModal__field">
                    <span className="spModal__label">PARENT FIRST NAME</span>
                    <input
                      className="spModal__input"
                      placeholder="(optional)"
                      value={form.parentFirstName}
                      onChange={(e) =>
                        setField("parentFirstName", e.target.value)
                      }
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">PARENT LAST NAME</span>
                    <input
                      className="spModal__input"
                      placeholder="(optional)"
                      value={form.parentLastName}
                      onChange={(e) =>
                        setField("parentLastName", e.target.value)
                      }
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">PARENT EMAIL</span>
                    <input
                      className="spModal__input"
                      type="email"
                      placeholder="(optional)"
                      value={form.parentEmail}
                      onChange={(e) => setField("parentEmail", e.target.value)}
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">PARENT PHONE</span>
                    <input
                      className="spModal__input"
                      type="tel"
                      placeholder="(optional)"
                      value={form.parentPhone}
                      onChange={(e) => setField("parentPhone", e.target.value)}
                      disabled={busy}
                    />
                  </label>
                </div>

                <p className="spModal__hint">
                  If you add a parent email now, you can later email the parent
                  automatically using “Save &amp; Share”.
                </p>
              </div>
            </section>

            {err && <p className="spModal__error">{err}</p>}
          </div>

          <footer className="spModal__foot">
            <button
              type="button"
              className="spModal__btn"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="spModal__btn spModal__btn--primary"
              disabled={busy}
            >
              {busy ? "Adding…" : "Add student"}
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  );
}
