import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import HomePage from "../../pages/HomePage";
import AboutPage from "../../pages/AboutPage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";

import DefaultLayout from "../../layouts/DefaultLayout";
import ProfileLayout from "../../layouts/ProfileLayout";

import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import NotFound from "../../pages/NotFound";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import ProtectedRoute from "../ProtectedRoute";

import { api } from "../../lib/api.js";

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith("/profile");

  const openSignUp = () => setAuthMode("signup");
  const openSignIn = () => setAuthMode("signin");
  const closeAuth = () => setAuthMode(null);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api("/api/auth/me");
        setUser(user || null);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  async function handleRegister({ name, email, password }) {
    const data = await api("/api/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
    setUser(data.user);
    closeAuth();
    navigate("/profile");
  }

  async function handleLogin({ email, password }) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(data.user);
    closeAuth();
    navigate("/profile");
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
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute isAuthed={!!user} />}>
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfilePage user={user} />} />
          </Route>
        </Route>
      </Routes>

      {!hideFooter && <Footer onSignUp={openSignUp} />}

      <ConfirmationModal
        isOpen={confirmSignOutOpen}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign out"
        cancelText="Stay signed in"
        onConfirm={async () => {
          try {
            await api("/api/auth/logout", { method: "POST" });
          } catch {}
          setUser(null);
          setConfirmSignOutOpen(false);
          navigate("/", { replace: true });
        }}
        onCancel={() => setConfirmSignOutOpen(false)}
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
