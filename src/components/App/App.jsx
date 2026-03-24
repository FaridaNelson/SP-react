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
import PrivacyPolicyPage from "../../pages/PrivacyPolicyPage.jsx";
import TermsOfServicePage from "../../pages/TermsOfServicePage.jsx";
import DefaultLayout from "../../layouts/DefaultLayout";
import ProfileLayout from "../../layouts/ProfileLayout";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import ProtectedRoute from "../ProtectedRoute";
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
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // auth mode: null | "signin" | "signup"
  const [authMode, setAuthMode] = useState(null);

  const [user, setUser] = useState(null);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isTeacherView = pathname.startsWith("/teacher");
  const isParentView = pathname.startsWith("/parent");
  const hideFooter = isTeacherView || isParentView;

  const openSignIn = () => setAuthMode("signin");
  const openSignUp = () => setAuthMode("signup");
  const closeAuth = () => setAuthMode(null);

  useEffect(() => {
    (async () => {
      try {
        const health = await api("/api/health");
        console.log("Health OK:", health);
      } catch (e) {
        console.error("Health ERROR:", e?.message, e);
      }

      try {
        const me = await api("/api/auth/me", { expectUnauthorized: true });
        if (me?.user) {
          console.log("ME OK:", me);
        }
      } catch (e) {
        console.warn("ME unexpected error:", e?.status, e?.message);
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
      try {
        const { user } = await api("/api/auth/me", {
          expectUnauthorized: true,
        });
        setUser(user || null);
      } catch {
        setUser(null);
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  if (!booted) return null;

  async function handleRegister(payload) {
    const data = await api("/api/auth/signup", {
      method: "POST",
      body: payload,
    });

    setUser(data.user);
    closeAuth();
    navigate(firstDashboardPath(data.user));
  }

  async function handleLogin({ email, password }) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

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

    setUser(null);
    setSelectedStudentId(null);
    setAuthMode(null);
    navigate("/", { replace: true });
  }

  return (
    <>
      <Header
        user={user}
        onSignIn={openSignIn}
        onSignUp={openSignUp}
        onSignOutRequest={() => setConfirmSignOutOpen(true)}
      />

      <Routes>
        <Route element={<DefaultLayout onSignUp={openSignUp} />}>
          <Route path="/" element={<HomePage onSignUp={openSignUp} />} />
          <Route path="/about" element={<AboutPage onSignUp={openSignUp} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
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
                    user={user}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                  />
                }
              />
            }
          />
        </Route>
      </Routes>

      {!hideFooter && <Footer onSignUp={openSignUp} />}

      <ConfirmationModal
        isOpen={confirmSignOutOpen}
        title="Sign Out"
        message={
          "Are you sure you want to sign out?\nYour progress is saved automatically."
        }
        confirmText="Sign out"
        cancelText="Stay signed in"
        onConfirm={async () => {
          await logout();
          setConfirmSignOutOpen(false);
        }}
        onCancel={() => setConfirmSignOutOpen(false)}
        autoFocus="confirm"
      />

      <LoginModal
        open={authMode === "signin"}
        onClose={closeAuth}
        onSwitch={openSignUp}
        onSubmit={handleLogin}
      />

      <RegisterModal
        open={authMode === "signup"}
        onClose={closeAuth}
        onSwitch={openSignIn}
        onSubmit={handleRegister}
      />
    </>
  );
}
