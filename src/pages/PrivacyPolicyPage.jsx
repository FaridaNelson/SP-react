// PrivacyPolicyPage.jsx
import "./LegalPages.css";

export default function PrivacyPolicyPage() {
  return (
    <main className="legalPage">
      <div className="legalPage__container">
        <h1 className="legalPage__title">STUDIOPULSE</h1>
        <h2 className="legalPage__subtitle">Privacy Policy</h2>

        <p className="legalPage__updated">Last Updated: March 12, 2026</p>

        <section className="legalPage__section">
          <h3>1. Introduction</h3>
          <p>
            StudioPulse ("we," "us," or "our") is committed to protecting your
            privacy and the privacy of minors who use our platform. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our music education platform.
          </p>

          <h4>Privacy Protection for Children</h4>
          <p>
            We take the privacy of children very seriously. We comply with the
            Children's Online Privacy Protection Act (COPPA) and require
            verifiable parental consent before collecting personal information
            from children under 13 years of age.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>2. Information We Collect</h3>

          <h4>2.1 Information from All Users</h4>

          <h5>Account Information:</h5>
          <ul>
            <li>Name (first and last)</li>
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>User type (teacher, student, parent)</li>
            <li>Instrument(s) studied or taught</li>
            <li>Grade level (for exam tracking)</li>
          </ul>

          <h5>Educational Data:</h5>
          <ul>
            <li>Homework assignments and completion status</li>
            <li>Progress assessments and grades</li>
            <li>Practice recordings and notes</li>
            <li>Lesson schedules and attendance</li>
            <li>Teacher feedback and comments</li>
          </ul>

          <h4>2.2 Information from Children Under 13</h4>
          <p>
            For users under 13 years of age, we collect only the minimum
            information necessary to provide our services, and only with
            verifiable parental consent.
          </p>

          <p>We do NOT collect from children under 13:</p>
          <ul>
            <li>Email addresses or phone numbers</li>
            <li>Social security numbers</li>
            <li>Street addresses</li>
            <li>Photos showing the child's face</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>3. How We Use Your Information</h3>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and maintain our music education platform</li>
            <li>
              Facilitate communication between teachers, students, and parents
            </li>
            <li>Track student progress and educational outcomes</li>
            <li>Assign and manage homework and practice assignments</li>
            <li>Schedule lessons and send reminders</li>
            <li>Process payments and manage subscriptions</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>

          <p>We do NOT use children's information for:</p>
          <ul>
            <li>Targeted advertising</li>
            <li>Building user profiles for commercial purposes</li>
            <li>Selling or renting to third parties</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>4. Information Sharing and Disclosure</h3>

          <h4>4.1 Within the Platform</h4>
          <p>Information is shared within the platform as follows:</p>

          <div className="legalPage__tableWrapper">
            <table className="legalPage__table">
              <thead>
                <tr>
                  <th>User Type</th>
                  <th>Can View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Teachers</td>
                  <td>
                    Student progress, assignments, practice recordings, parent
                    contact info
                  </td>
                </tr>
                <tr>
                  <td>Students</td>
                  <td>Own progress, assignments, teacher feedback, homework</td>
                </tr>
                <tr>
                  <td>Parents</td>
                  <td>
                    Child's complete account, progress, assignments, teacher
                    communications
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="legalPage__section">
          <h3>5. Parental Rights and Controls</h3>
          <p>Parents and guardians have the right to:</p>
          <ul>
            <li>Review: View all information collected from their child</li>
            <li>Modify: Correct or update their child's information</li>
            <li>
              Delete: Request deletion of their child's account and all
              associated data
            </li>
            <li>
              Revoke Consent: Withdraw consent and prevent further collection
            </li>
            <li>Export Data: Receive a copy of their child's information</li>
          </ul>

          <p>To exercise these rights, contact us at privacy@studiopulse.co</p>
        </section>

        <section className="legalPage__section">
          <h3>6. Data Security</h3>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>SSL/TLS encryption for data in transit</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Secure password hashing (bcrypt)</li>
            <li>Regular security audits and penetration testing</li>
            <li>Multi-factor authentication for teachers</li>
            <li>Regular data backups with encryption</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>7. Data Retention</h3>
          <p>
            We retain your information for as long as your account is active.
            When an account is deleted, personal information is permanently
            deleted within 30 days. For children's accounts, upon parental
            request or when a child turns 18, we delete all personal information
            associated with the child.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>8. Contact Us</h3>
          <p>For questions about this Privacy Policy, please contact:</p>
          <p>Privacy Team</p>
          <p>StudioPulse</p>
          <p>Email: privacy@studiopulse.co</p>
          <p>Address: [Your Business Address]</p>
        </section>
      </div>
    </main>
  );
}
