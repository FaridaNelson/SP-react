import { useState } from "react";
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

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState({
    name: "Farida Nelson",
    email: "faridanelson@gmail.com",
    _id: "mock123",
  });
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith("/profile");

  const closeAuth = () => setAuthMode(null);

  return (
    <>
      <Header
        user={user}
        onSignIn={() => setAuthMode("signin")}
        onSignUp={() => setAuthMode("signup")}
        onSignOutRequest={() => setConfirmSignOutOpen(true)}
      />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          element={
            <ProfileLayout
              user={user}
              onSignIn={() => setAuthMode("signin")}
              onSignUp={() => setAuthMode("signup")}
            />
          }
        >
          <Route path="/profile" element={<ProfilePage user={user} />} />
        </Route>
      </Routes>

      {!hideFooter && <Footer />}

      <ConfirmationModal
        isOpen={confirmSignOutOpen}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign out"
        cancelText="Stay signed in"
        onConfirm={() => {
          setUser(null);
          setConfirmSignOutOpen(false);
          Navigate("/");
        }}
        onCancel={() => setConfirmSignOutOpen(false)}
      />
      <LoginModal
        open={authMode === "signin"}
        onClose={closeAuth}
        onSwitch={() => setAuthMode("signup")}
      />
      <RegisterModal
        open={authMode === "signup"}
        onClose={closeAuth}
        onSwitch={() => setAuthMode("signin")}
      />
    </>
  );
}
