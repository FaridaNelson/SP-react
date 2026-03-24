import { useMemo } from "react";

/**
 * Thin wrapper that normalises auth props into a consistent shape.
 * No context needed yet — just pass the user prop from App.
 */
export function useAuth(user) {
  const roles = useMemo(
    () =>
      Array.isArray(user?.roles) ? user.roles : user?.role ? [user.role] : [],
    [user],
  );

  return {
    user,
    roles,
    isAuthed: !!user,
    isTeacher: roles.includes("teacher") || roles.includes("admin"),
    isParent: roles.includes("parent") || roles.includes("admin"),
    isAdmin: roles.includes("admin"),
  };
}
