import "./LegalPages.css";

export default function PrivacyPolicyPage() {
  return (
    <div className="legalPage">
      <div className="legalPage__container">
        <h1 className="legalPage__title">Privacy Policy</h1>

        <p className="legalPage__updated">Last updated: 2026</p>

        <section className="legalPage__section">
          <h2>Introduction</h2>
          <p>
            StudioPulse respects your privacy and is committed to protecting
            your personal data. This privacy policy explains how we collect,
            use, and safeguard your information when you use the StudioPulse
            platform.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Information We Collect</h2>
          <ul>
            <li>Account information (name, email address)</li>
            <li>Profile information such as instrument and teacher details</li>
            <li>Student and parent relationship information</li>
            <li>Usage and platform interaction data</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h2>How We Use Information</h2>
          <p>We use collected data to:</p>
          <ul>
            <li>Provide and maintain the StudioPulse service</li>
            <li>Allow teachers, students, and parents to collaborate</li>
            <li>Improve product features and reliability</li>
            <li>Maintain platform security</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h2>Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information. However, no system can guarantee absolute security.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            data by contacting StudioPulse support.
          </p>
        </section>

        <section className="legalPage__section">
          <h2>Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            StudioPulse.
          </p>
        </section>
      </div>
    </div>
  );
}
