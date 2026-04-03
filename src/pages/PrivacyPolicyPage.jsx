import { Link } from "react-router-dom";
import "./LegalPages.css";

export default function PrivacyPolicyPage() {
  return (
    <main className="legalPage">
      <div className="legalPage__container">
        <Link
          to="/"
          state={{ openAuth: "signup" }}
          className="legalPage__backLink"
        >
          ← Back to Sign Up
        </Link>
        <h1 className="legalPage__title">
          <svg
            width="38"
            height="16"
            viewBox="0 0 38 16"
            fill="none"
            style={{ flexShrink: 0, verticalAlign: "middle" }}
          >
            <line
              x1="0"
              y1="8"
              x2="5"
              y2="8"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <polyline
              points="5,8 7.5,8 9,2 11,14 13,4 15,12 17,8 19,8"
              stroke="#C9A84C"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <line
              x1="19"
              y1="8"
              x2="38"
              y2="8"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
          STUDIOPULSE
        </h1>
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
          <div className="legalPage__alert">
            <h4>Privacy Protection for Children</h4>
            <p>
              We take the privacy of children very seriously. We comply with the
              Children's Online Privacy Protection Act (COPPA) and require
              verifiable parental consent before collecting personal information
              from children under 13 years of age.
            </p>
          </div>
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

          <h5>Profile Information:</h5>
          <ul>
            <li>Profile photo (optional)</li>
            <li>Teacher credentials and experience (teachers only)</li>
            <li>Teacher credentials and experience (teachers only)</li>
            <li>Parent/guardian contact information (for minors)</li>
          </ul>

          <h5>Educational Data:</h5>
          <ul>
            <li>Homework assignments and completion status</li>
            <li>Progress assessments and grades</li>
            <li>Practice recordings and notes</li>
            <li>Lesson schedules and attendance</li>
            <li>Teacher feedback and comments</li>
            <li>Exam preparation progress</li>
          </ul>

          <h5>Communication Data:</h5>
          <ul>
            <li>Messages between teachers, students, and parents</li>
            <li>Notifications and alerts</li>
            <li>Support requests and correspondence</li>
          </ul>

          <h5>Technical Information:</h5>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Usage data (pages viewed, features used, time spent) s</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h4>2.2 Information from Children Under 13</h4>
          <p>
            For users under 13 years of age, we collect only the minimum
            information necessary to provide our services, and only with
            verifiable parental consent:
          </p>
          <ul>
            <li>First name and last initial (not full last name publicly)</li>
            <li>
              Username (not containing personally identifiable information)
            </li>
            <li>Parent/guardian name and email address</li>
            <li>
              Educational progress data shared with teacher and parent only
            </li>
          </ul>

          <p>We do NOT collect from children under 13:</p>
          <ul>
            <li>Email addresses or phone numbers</li>
            <li>Social security numbers</li>
            <li>Street addresses</li>
            <li>
              Photos showing the child's face (profile pictures must be abstract
              or instrument-focused)
            </li>
            <li>
              Any information beyond what is reasonably necessary for the
              educational purpose
            </li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>3. How We Use Your Information</h3>
          <h4>3.1 Primary Uses</h4>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and maintain our music education platform</li>
            <li>
              Facilitate communication between teachers, students, and parents
            </li>
            <li>Track student progress and educational outcomes</li>
            <li>Assign and manage homework and practice assignments</li>
            <li>Schedule lessons and send reminders</li>
            <li>Generate progress reports and assessments</li>
            <li>Verify teacher credentials and approve accounts</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important updates and notifications</li>
            <li>Provide customer support</li>
            <li>Improve and personalize our services</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>

          <h4>3.2 Limitations on Use of Children's Information</h4>
          <p>Information from children under 13 is used ONLY for:</p>
          <ul>
            <li>Providing the core educational services</li>
            <li>Ensuring platform safety and security</li>
            <li>
              Communicating with parents/guardians about their child's progress
            </li>
            <li>Complying with legal obligations</li>
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
                  <td>
                    <strong>Teachers</strong>
                  </td>
                  <td>
                    Student progress, assignments, practice recordings, parent
                    contact info
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Students</strong>
                  </td>
                  <td>Own progress, assignments, teacher feedback, homework</td>
                </tr>
                <tr>
                  <td>
                    <strong>Parents</strong>
                  </td>
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
          <h4>4.2 Third-Party Service Providers</h4>
          <p>
            We may share information with trusted third-party service providers
            who assist us in:
          </p>
          <ul>
            <li>Cloud hosting and data storage</li>
            <li>Payment processing</li>
            <li>Email delivery</li>
            <li>Analytics and performance monitoring</li>
            <li>Customer support tools</li>
          </ul>
          <p>These providers are contractually obligated to:</p>
          <ul>
            <li>Use information only for the specified purpose</li>
            <li>Maintain strict confidentiality</li>
            <li>Comply with applicable privacy laws, including COPPA</li>
            <li>Delete information when no longer needed</li>
          </ul>

          <h4>4.3 Legal Requirements</h4>
          <p>We may disclose information when required by law or to:</p>
          <ul>
            <li>Comply with legal process or government requests</li>
            <li>Enforce our Terms of Service</li>
            <li>
              Protect the rights, property, or safety of StudioPulse, our users,
              or the public
            </li>
            <li>
              Detect, prevent, or address fraud, security, or technical issues
            </li>
            <li>Respond to reports of child safety concerns</li>
          </ul>

          <h4>4.4 What We Never Do</h4>
          <p>We will NEVER:</p>
          <ul>
            <li>Sell or rent personal information to third parties</li>
            <li>Share children's information with advertisers</li>
            <li>Use student data for advertising purposes</li>
            <li>Display third-party advertising to users under 18</li>
            <li>Share information publicly without explicit consent</li>
          </ul>
        </section>
        <section className="legalPage__section">
          <h3>5. Parental Rights and Controls</h3>
          <h4>5.1 Parental Consent</h4>
          <p>
            Before collecting information from a child under 13, we obtain
            verifiable parental consent through:
          </p>
          <ul>
            <li>Email confirmation with consent form </li>
            <li>
              Credit card verification (small charge, immediately refunded)
            </li>
            <li>Video conference verification</li>
            <li>with parent Signed consent form submitted by teacher</li>
          </ul>

          <h4>5.2 Parent Access and Control</h4>
          <p>Parents and guardians have the right to:</p>
          <ul>
            <li>
              <strong>Review:</strong> View all information collected from their
              child
            </li>
            <li>
              <strong>Modify:</strong> Correct or update their child's
              information
            </li>
            <li>
              <strong>Delete:</strong> Request deletion of their child's account
              and all associated data
            </li>
            <li>
              <strong>Revoke Consent:</strong> Withdraw consent and prevent
              further collection
            </li>
            <li>
              <strong>Export Data:</strong> Receive a copy of their child's
              information
            </li>
          </ul>

          <p>To exercise these rights, contact us at privacy@studiopulse.co</p>

          <h4>5.3 Parent Dashboard</h4>
          <p>Parents have access to a dedicated dashboard where they can:</p>
          <ul>
            <li>View their child's activity and progress</li>
            <li>Monitor messages between teacher and student</li>
            <li>Adjust privacy settings</li>
            <li>Download progress reports</li>
            <li>Manage account setting</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>6. Data Security</h3>
          <h4>6.1 Security Measures</h4>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>SSL/TLS encryption for data in transit</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Secure password hashing (bcrypt)</li>
            <li>Regular security audits and penetration testing</li>
            <li>Role-based access controls</li>
            <li>Multi-factor authentication for teachers</li>
            <li>Automatic logout after inactivity</li>
            <li>Regular data backups with encryption</li>
            <li>Employee training on data protection</li>
          </ul>
          <h4>6.2 Data Breach Response</h4>
          <p>
            In the event of a data breach affecting children's information, we
            will:
          </p>
          <ul>
            <li>Notify affected parents within 72 hours</li>
            <li>Report to relevant authorities as required by law</li>
            <li>Provide details about the breach and steps being taken</li>
            <li>Offer assistance and resources to affected users</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>7. Data Retention</h3>
          <h4>7.1 Active Accounts</h4>
          <p>
            We retain your information for as long as your account is active and
            as needed to provide services.
          </p>

          <h4>7.2 Account Deletion</h4>
          <p>When an account is deleted:</p>
          <ul>
            <li>Personal information is permanently deleted within 30 days</li>
            <li>
              Educational records may be retained in anonymized form for quality
              improvement
            </li>
            <li>Backups containing deleted data are purged within 90 days</li>
            <li>Legal or financial records are retained as required by law</li>
          </ul>

          <h4>7.3 Children's Accounts</h4>
          <p>Upon parental request or when a child turns 18, we:</p>
          <ul>
            <li>Delete all personal information associated with the child</li>
            <li>
              {" "}
              Provide option to transfer account to adult status (age 18+)
            </li>
            <li>
              Maintain only de-identified data for educational research (with
              consent)
            </li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>8. Cookies and Tracking Technologies</h3>
          <h4> 8.1 WHat We Use</h4>
          <p>We use cokies and similar technologies for:</p>
          <ul>
            <li>Authentication and session management</li>
            <li>Remembering user preferences</li>
            <li>Analytics and performance monitoring</li>
            <li>Security and fraud prevention</li>
          </ul>

          <h4>8.2 Third-Party Cookies</h4>
          <p>
            We may use third-party analytics services (e.g. Google Analytics)
            configured to:
          </p>
          <ul>
            <li>Not collect personally identifiable information</li>
            <li>Anonymize IP addresses</li>
            <li>Respect Do Not Track signals</li>
          </ul>

          <h4>8.3 Cookie Controls</h4>
          <p>
            You can control cookies through your browser settings. Note that
            disabling cookies may limit platform functionality.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>9. International Data Transfers</h3>
          <p>
            StudioPulse is based in the United States. If you access our
            services from outside this jurisdiction, your information may be
            transferred to, stored, and processed in the United States. We
            ensure appropriate safeguards are in place for international
            transfers.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>10. Your Rights</h3>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of your personal
              information.
            </li>
            <li>
              <strong>Correction:</strong> Request correction of any inaccurate
              or incomplete information.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal
              information.
            </li>
            <li>
              <strong>Portability:</strong> Receive your data in a structured,
              machine-readable format
            </li>
            <li>
              <strong>Objection:</strong> Object to certain processing
              activities
            </li>
            <li>
              <strong>Restriction:</strong> Request restriction of processing
            </li>
            <li>
              <strong>Withdraw Consent:</strong> Withdraw previously given
              consent
            </li>
          </ul>

          <p>To exercise these rights, contact us at info@studiopulse.co</p>
        </section>
        <section className="legalPage__section">
          <h3>11. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by:
          </p>
          <ul>
            <li>Email notification to registered users</li>
            <li>Prominent notice on the platform</li>
            <li>Direct notification to parents of children under 13</li>
          </ul>
          <p>
            For children's information, we will obrain renewed parental consent
            if changes materially affect our collection or use practices.
          </p>
        </section>
        <section className="legalPage__section">
          <h3>12. Contact Us</h3>
          <p>For questions about this Privacy Policy, please contact:</p>
          <p>
            <strong>Privacy Team</strong>
            <br />
            StudioPulse
            <br />
            Email: info@studiopulse.co
            <br />
            Address: 2883 Hopyard Road \#1049, Pleasanton, CA, USA, 94588
          </p>
          <section className="legalPage__notice">
            <h4 className="legalPage__noticeTitle">
              Parents: We"re Here to Help
            </h4>
            <p>
              If you have any questions about how we protect your child's
              privacy or wish to exercise your parental rights, please don't
              hesitate to contact us. We are committed to transparency and
              protecting the privacy of all our young users.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
