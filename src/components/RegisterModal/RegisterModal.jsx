import Modal from "../Modal/Modal";

export default function RegisterModal({ open, onClose, onSwitch }) {
  const submit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Sign Up">
      <form onSubmit={submit} className="authForm">
        <label className="label">Please, enter your information below:</label>
        <input className="input" type="text" placeholder="User Name" required />
        <input className="input" type="email" placeholder="Email" required />
        <input
          className="input"
          type="password"
          placeholder="Password"
          required
        />
        <div className="modal__actions">
          <button type="submit" className="btn-submit">
            Sign up
          </button>

          <p className="help">Already have an account? </p>
          <button
            type="button"
            className="btn-submit btn-switch"
            onClick={onSwitch}
          >
            Log in
          </button>
        </div>
      </form>
    </Modal>
  );
}
