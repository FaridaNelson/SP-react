import { useState } from "react";
import Header from "../Header/Header";
import Home from "../Home/Home";
import NavGuide from "../NavGuide/NavGuide";
import ConsistentPractice from "../ConsistentPractice/ConsistentPractice";
import Footer from "../Footer/Footer";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import { set } from "mongoose";

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const closeAuth = () => setAuthMode(null);

  const user = null; // Replace with actual user state management

  return (
    <>
      <Header
        user={null}
        onSignIn={() => setAuthMode("signin")}
        onSignUp={() => setAuthMode("signup")}
      />
      <Home />
      <NavGuide />
      <ConsistentPractice />
      <Footer />
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
