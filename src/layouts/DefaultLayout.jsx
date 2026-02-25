import { Outlet } from "react-router-dom";

export default function DefaultLayout({ onSignUp }) {
  return (
    <div className="layout layout_default">
      <Outlet context={{ onSignUp }} />
    </div>
  );
}
