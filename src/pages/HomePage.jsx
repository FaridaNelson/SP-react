import Home from "../components/Home/Home";
import NavGuide from "../components/NavGuide/NavGuide";
import ConsistentPractice from "../components/ConsistentPractice/ConsistentPractice";

export default function HomePage({ onSignUp }) {
  return (
    <>
      <Home />
      <NavGuide />
      <ConsistentPractice onSignUp={onSignUp} />
    </>
  );
}
