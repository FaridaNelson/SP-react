import { GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import "./Home.css";
import FeatureCard from "./FeatureCard";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="container section section--no-border section--tightTop hero">
        <h1 className="hero__title">Welcome to StudioPulse</h1>
        <p className="hero__subtitle">
          The ultimate connecting link between teachers, parents, and students.
          Streamline homework assignments, track progress, and support student
          success—together.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="container section how">
        <h2 className="how__title">How StudioPulse Works</h2>

        <div className="how__grid">
          <FeatureCard
            title="Teacher Assigns"
            text="Teachers create and assign homework tasks to students with clear instructions and deadlines."
            Icon={(p) => <GraduationCap {...p} />}
          />
          <FeatureCard
            title="Student Completes"
            text="Students access their assignments, complete tasks, and submit their work through the platform."
            Icon={(p) => <BookOpen {...p} />}
          />
          <FeatureCard
            title="Parent Monitors"
            text="Parents stay informed with real-time progress updates and detailed performance insights."
            Icon={(p) => <TrendingUp {...p} />}
          />
        </div>
      </section>
    </main>
  );
}
