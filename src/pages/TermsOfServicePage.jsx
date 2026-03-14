import "./LegalPages.css";

export default function TermsOfServicePage() {
  return (
    <div className="legalPage">
      <div className="legalPage__container">
        <h1 className="legalPage__title">Terms of Service</h1>

        <p className="legalPage__updated">Last updated: 2026</p>

        <section className="legalPage__section">
          <h2>Acceptance of Terms</h2>
          <p>
            By using the StudioPulse platform, you agree to comply with and be
            bound by these Terms of Service.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Accounts</h2>
          <p>
            Users must provide accurate information when creating an account.
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Platform Usage</h2>
          <p>
            StudioPulse is designed to support music teachers, students, and
            parents in organizing lessons, progress tracking, and educational
            activities.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Prohibited Conduct</h2>
          <ul>
            <li>Unauthorized access to accounts</li>
            <li>Interfering with platform functionality</li>
            <li>Using the platform for illegal activities</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h2>Limitation of Liability</h2>
          <p>
            StudioPulse shall not be liable for damages resulting from use of
            the platform to the maximum extent permitted by law.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Changes to Terms</h2>
          <p>
            StudioPulse may update these terms periodically. Continued use of
            the platform indicates acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
