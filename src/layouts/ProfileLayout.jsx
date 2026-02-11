import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <div className="layout layout_profile">
      <Outlet />
    </div>
  );
}
