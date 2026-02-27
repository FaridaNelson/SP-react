import { useState } from "react";
import Modal from "../../../components/Modal/Modal";
import "./AddStudentModal.css";

export default function AddStudentModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    instrument: "",
    grade: "",
    parentName: "",
    parentEmail: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);

    const payload = {
      name: form.studentName.trim(),
      email: form.studentEmail.trim(),
      instrument: form.instrument.trim(),
      grade: Number(form.grade),
      parent: {
        name: form.parentName.trim(),
        email: form.parentEmail.trim(),
      },
    };

    try {
      const created = await onSubmit?.(payload); // <-- parent will do the API call
      // optional: reset form so next add starts clean
      setForm({
        studentName: "",
        studentEmail: "",
        instrument: "",
        grade: "",
        parentName: "",
        parentEmail: "",
      });
      onClose?.(); // parent also closes; safe to keep
      return created;
    } catch (e) {
      setErr(e?.message || "Failed to add student");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      panelClassName="spModal__panel"
      title={null}
      variant="slideRight"
    >
      {/* “Panel-style” header */}
      <div className="spModal__content">
        <header className="spModal__head">
          <div>
            <div className="spModal__kicker"></div>
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
                    <span className="spModal__label">STUDENT NAME</span>
                    <input
                      className="spModal__input"
                      placeholder="e.g., Emma Johnson"
                      value={form.studentName}
                      onChange={(e) => set("studentName", e.target.value)}
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
                      onChange={(e) => set("studentEmail", e.target.value)}
                      required
                      disabled={busy}
                    />
                  </label>

                  <label className="spModal__field">
                    <span className="spModal__label">INSTRUMENT</span>
                    <select
                      className="spModal__input"
                      value={form.instrument}
                      onChange={(e) => set("instrument", e.target.value)}
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
                      onChange={(e) => set("grade", e.target.value)}
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
                    <span className="spModal__label">PARENT NAME</span>
                    <input
                      className="spModal__input"
                      placeholder="(optional)"
                      value={form.parentName}
                      onChange={(e) => set("parentName", e.target.value)}
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
                      onChange={(e) => set("parentEmail", e.target.value)}
                      disabled={busy}
                    />
                  </label>
                </div>

                <p className="spModal__hint">
                  If you add a parent email now, you can later email the parent
                  automatically, just click “Save & Share”.
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
