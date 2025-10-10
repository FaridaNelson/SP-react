import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import HomePage from "../../pages/HomePage";
import AboutPage from "../../pages/AboutPage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import ParentProfilePage from "../../pages/ParentProfilePage/ParentProfilePage.jsx";
import TeacherDashboard from "../../pages/TeacherProfilePage/TeacherDashboard.jsx";
import DefaultLayout from "../../layouts/DefaultLayout";
import ProfileLayout from "../../layouts/ProfileLayout";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import ProtectedRoute from "../ProtectedRoute";
import RoleSelectModal from "../../components/RoleSelectModal/RoleSelectModal.jsx";
import { api } from "../../lib/api.js";
import NotFound from "../../pages/NotFound.jsx";

const normalizeRoles = (user) =>
  Array.isArray(user?.roles) ? user.roles : user?.role ? [user.role] : [];

const firstDashboardPath = (user) => {
  const r = normalizeRoles(user);
  if (r.includes("admin")) return "/teacher";
  if (r.includes("teacher")) return "/teacher";
  if (r.includes("parent")) return "/parent";
  return "/profile";
};

export function RoleRoute({ user, allowedRoles, element }) {
  const userRoles = normalizeRoles(user);
  const allowed = allowedRoles.some((r) => userRoles.includes(r));
  return allowed ? element : <Navigate to={firstDashboardPath(user)} replace />;
}

export default function App() {
  const [booted, setBooted] = useState(false);
  // selected student for teacher view
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // auth mode: null | "signin" | "signup" | "role"
  const [authMode, setAuthMode] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);

  // user/session
  const [user, setUser] = useState(null);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith("/profile");

  // CTA helpers
  const openRolePicker = () => setAuthMode("role");
  const openSignIn = () => setAuthMode("signin");
  const closeAuth = () => {
    setAuthMode(null);
    setPendingRole(null);
  };

  // role → path mapping
  const roleToPath = {
    student: "/profile",
    teacher: "/teacher",
    parent: "/parent",
  };

  // test effect
  useEffect(() => {
    console.log("App sees API_BASE =", import.meta.env.VITE_API_BASE);

    (async () => {
      try {
        const health = await api("/api/health", {
          auth: false,
        });
        console.log("Health OK:", health);
      } catch (e) {
        console.error("Health ERROR:", e?.message, e);
      }

      try {
        const me = await api("/api/auth/me", {
          auth: false,
        });
        console.log("ME OK:", me);
      } catch (e) {
        // Expect 401 if no token; I want to see network reachability
        console.warn(
          "ME expected error (likely 401 without token):",
          e?.status,
          e?.message
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (!booted || !user) return;
    const target = firstDashboardPath(user);
    if (
      ["/teacher", "/parent", "/profile"].includes(pathname) &&
      pathname !== target
    ) {
      navigate(target, { replace: true });
    }
  }, [booted, user, pathname, navigate]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setBooted(true);
        return;
      }
      try {
        const { user } = await api("/api/auth/me");
        setUser(user || null);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  if (!booted) return null;

  async function handleRegister({ name, email, password, role, studentId }) {
    const data = await api("/api/auth/signup", {
      method: "POST",
      body: { name, email, password, role, studentId },
    });
    if (data.token) localStorage.setItem("token", data.token);
    setUser(data.user);
    closeAuth();
    navigate(firstDashboardPath(data.user));
  }

  async function handleLogin({ email, password }) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data.token) localStorage.setItem("token", data.token);
    setUser(data.user);
    closeAuth();
    navigate(firstDashboardPath(data.user));
  }

  async function logout({ skipApi = false } = {}) {
    try {
      if (!skipApi) {
        await api("/api/auth/logout", { method: "POST" });
      }
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem("token"); // remove header token
    setUser(null);
    setSelectedStudentId(null);
    setAuthMode(null);
    setPendingRole(null);
    navigate("/", { replace: true });
  }

  return (
    <>
      <Header
        user={user}
        onSignIn={openSignIn}
        onSignUp={openRolePicker}
        onSignOutRequest={() => setConfirmSignOutOpen(true)}
      />

      <Routes>
        <Route element={<DefaultLayout onSignUp={openRolePicker} />}>
          <Route path="/" element={<HomePage onSignUp={openRolePicker} />} />
          <Route
            path="/about"
            element={<AboutPage onSignUp={openRolePicker} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute isAuthed={!!user} />}>
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfilePage user={user} />} />
          </Route>

          <Route
            path="/parent"
            element={
              <RoleRoute
                user={user}
                allowedRoles={["parent", "admin"]}
                element={
                  <ParentProfilePage studentId={user?.studentId} user={user} />
                }
              />
            }
          />

          <Route
            path="/teacher"
            element={
              <RoleRoute
                user={user}
                allowedRoles={["teacher", "admin"]}
                element={
                  <TeacherDashboard
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                  />
                }
              />
            }
          />
        </Route>
      </Routes>

      {!hideFooter && <Footer onSignUp={openRolePicker} />}

      <ConfirmationModal
        isOpen={confirmSignOutOpen}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign out"
        cancelText="Stay signed in"
        onConfirm={async () => {
          await logout();
          setConfirmSignOutOpen(false);
        }}
        onCancel={() => setConfirmSignOutOpen(false)}
        autoFocus="confirm"
      />

      {/* Step 1: Role selection */}
      <RoleSelectModal
        open={authMode === "role"}
        onClose={closeAuth}
        onPick={(role) => {
          setPendingRole(role);
          setAuthMode("signup"); // move to signup with chosen role
        }}
      />

      {/* Step 2: Sign in / Sign up */}
      <LoginModal
        open={authMode === "signin"}
        onClose={closeAuth}
        onSwitch={openRolePicker}
        onSubmit={handleLogin}
      />

      <RegisterModal
        open={authMode === "signup"}
        onClose={closeAuth}
        onSwitch={openSignIn}
        onSubmit={handleRegister}
        initialRole={pendingRole}
      />
    </>
  );
}
