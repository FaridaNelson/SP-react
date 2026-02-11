import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isAuthed }) {
  return isAuthed ? <Outlet /> : <Navigate to="/" replace />;
}
