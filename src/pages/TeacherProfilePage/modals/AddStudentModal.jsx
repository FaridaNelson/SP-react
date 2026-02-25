import { useState } from "react";
import Modal from "../../../components/Modal/Modal";

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
    <Modal open={open} onClose={onClose} title="Add a student">
      <form className="authForm" onSubmit={handleAddStudent}>
        <h4 style={{ margin: "8px 0" }}>Student Information</h4>
        <input
          className="input"
          placeholder="Student name"
          value={form.studentName}
          onChange={(e) => set("studentName", e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Student email address"
          value={form.studentEmail}
          onChange={(e) => set("studentEmail", e.target.value)}
          required
        />
        <select
          className="input"
          value={form.instrument}
          onChange={(e) => set("instrument", e.target.value)}
          required
        >
          <option value="">Select instrument</option>
          <option value="Piano">Piano</option>
          <option value="Voice">Voice</option>
          <option value="Guitar">Guitar</option>
        </select>
        <input
          className="input"
          type="number"
          min={1}
          max={8}
          placeholder="Grade (1-8)"
          value={form.grade}
          onChange={(e) => set("grade", e.target.value)}
          required
        />

        <h4 style={{ margin: "16px 0 8px" }}>Parent Information</h4>
        <input
          className="input"
          placeholder="Parent name"
          value={form.parentName}
          onChange={(e) => set("parentName", e.target.value)}
        />
        <input
          className="input"
          type="email"
          placeholder="Parent email address"
          value={form.parentEmail}
          onChange={(e) => set("parentEmail", e.target.value)}
        />

        {err && <p className="error">{err}</p>}

        <div className="modal__actions">
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? "Adding…" : "Add a student"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
