import Modal from "../Modal/Modal";
import "./LoginModal.css";

export default function LoginModal({ open, onClose, onSwitch, onSuccess }) {
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email");
    // TODO: replace with real auth; name pulled from server
    onSuccess?.({ name: "Farida Nelson", email });
  };

  return (
    <Modal open={open} onClose={onClose} title="Log In">
      <form onSubmit={submit} className="authForm">
        <label className="label">
          Please, enter your login information below:
        </label>
        <input className="input" type="email" placeholder="Email" required />
        <input
          className="input"
          type="password"
          placeholder="Password"
          required
        />
        <div className="modal__actions">
          <button type="submit" className="btn-submit">
            Log In
          </button>
          <p className="help"></p>
          Don't have an account?
          <button
            type="button"
            className="btn-submit btn-switch"
            onClick={onSwitch}
          >
            Sign Up
          </button>
        </div>
      </form>
    </Modal>
  );
}
