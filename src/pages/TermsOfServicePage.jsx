import { Link } from "react-router-dom";
import "./LegalPages.css";

export default function TermsOfServicePage() {
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
        <h2 className="legalPage__subtitle">Terms of Service</h2>

        <p className="legalPage__updated">Last Updated: March 12, 2026</p>

        <section className="legalPage__section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            Welcome to StudioPulse. By accessing or using our platform, you
            agree to be bound by these Terms of Service ("Terms"). If you do not
            agree to these Terms, please do not use our services.
          </p>
          <p>
            StudioPulse provides an online platform connecting music teachers,
            students, and parents to facilitate music education, progress
            tracking, and communication.
          </p>
          <div className="legalPage__notice">
            <h4>Important Notice for Parents and Guardians</h4>
            <p>
              If you are under 18 years of age, you must have your parent or
              legal guardian read and agree to these Terms on your behalf.
              Parents or guardians who create accounts for their children are
              responsible for all activities under those accounts.
            </p>
          </div>
        </section>

        <section className="legalPage__section">
          <h3>2. Account Registration and User Types</h3>

          <h4>2.1 User Categories</h4>
          <p>StudioPulse supports three types of users:</p>
          <ul>
            <li>
              <strong>Teachers:</strong> Music instructors who create and manage
              student accounts, assign homework, track progress, and communicate
              with parents.
            </li>
            <li>
              <strong>Students:</strong> Individuals receiving music
              instruction. Students under 18 must have parental consent to use
              the platform.
            </li>
            <li>
              <strong>Parents/Guardians:</strong> Adults who monitor their
              child's progress, communicate with teachers, and manage account
              settings for minors.
            </li>
          </ul>

          <h4>2.2 Account Requirements</h4>
          <ul>
            <li>
              You must provide accurate, current, and complete information
              during registration.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials.
            </li>
            <li>
              You must be at least 13 years old to create a student account,
              with parental consent required for users under 18.
            </li>
            <li>
              Teacher accounts require verification of credentials and are
              subject to approval.
            </li>
            <li>One person may not create multiple accounts.</li>
          </ul>

          <h4>2.3 Parental Consent for Minors</h4>
          <p>
            In compliance with the Children's Online Privacy Protection Act
            (COPPA) and similar regulations:
          </p>
          <ul>
            <li>
              We require verifiable parental consent before collecting personal
              information from children under 13.
            </li>
            <li>
              Parents have the right to review, modify, or request deletion of
              their child's information.
            </li>
            <li>
              Parents can revoke consent and request deletion of their child's
              account at any time.
            </li>
            <li>
              Teachers must obtain parental consent before adding students under
              18 to the platform.
            </li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>3. User Responsibilities and Conduct</h3>

          <h4>3.1 Acceptable Use</h4>
          <p>
            You agree to use StudioPulse only for lawful purposes and in
            accordance with these Terms. You agree NOT to:
          </p>
          <ul>
            <li>Violate any applicable laws or regulations.</li>
            <li>
              Infringe on the rights of others, including intellectual property
              rights.
            </li>
            <li>Upload or transmit viruses, malware, or any harmful code.</li>
            <li>Harass, abuse, or harm other users, particularly minors.</li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation.
            </li>
            <li>
              Collect or store personal data of other users without permission.
            </li>
            <li>
              Use automated systems to access the platform without
              authorization.
            </li>
            <li>Interfere with or disrupt the platform's operation.</li>
          </ul>

          <h4>3.2 Teacher Responsibilities</h4>
          <p>Teachers agree to:</p>
          <ul>
            <li>
              Obtain proper parental consent before adding minor students to the
              platform.
            </li>
            <li>
              Maintain professional conduct in all communications with students
              and parents.
            </li>
            <li>Provide accurate progress assessments and feedback.</li>
            <li>Protect the privacy and safety of all students.</li>
            <li>Not share login credentials with students or third parties.</li>
            <li>Report any suspected misuse or safety concerns immediately.</li>
          </ul>

          <h4>3.3 Parent/Guardian Responsibilities</h4>
          <p>Parents and guardians agree to:</p>
          <ul>
            <li>
              Supervise their child's use of the platform as appropriate for
              their age.
            </li>
            <li>
              Review and monitor their child's account activity and
              communications.
            </li>
            <li>Ensure their child complies with these Terms.</li>
            <li>
              Keep their contact information current for important notices.
            </li>
            <li>Report any concerns about safety or inappropriate content.</li>
          </ul>
        </section>

        <section className="legalPage__section">
          <h3>4. Content and Intellectual Property</h3>

          <h4>4.1 User Content</h4>
          <p>
            Users may upload content such as practice recordings, homework
            assignments, notes, and messages ("User Content"). You retain
            ownership of your User Content, but grant StudioPulse a license to
            use, store, and display this content as necessary to provide our
            services.
          </p>

          <h4>4.2 Platform Content</h4>
          <p>
            All content provided by StudioPulse, including but not limited to
            text, graphics, logos, software, and design elements, is owned by
            StudioPulse or its licensors and is protected by copyright and other
            intellectual property laws.
          </p>

          <h4>4.3 Music and Educational Materials</h4>
          <p>
            Users are responsible for ensuring they have proper licenses or
            permissions for any copyrighted music, sheet music, or educational
            materials they upload to the platform.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>5. Privacy and Data Protection</h3>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to
            understand how we collect, use, and protect your information,
            especially regarding minors.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>6. Payment and Subscriptions</h3>

          <h4>6.1 Fees</h4>
          <p>
            StudioPulse may offer both free and paid subscription tiers. Pricing
            and features are subject to change with reasonable notice.
          </p>

          <h4>6.2 Billing</h4>
          <ul>
            <li>
              Subscription fees are billed in advance on a recurring basis.
            </li>
            <li>
              You authorize us to charge your payment method for applicable
              fees.
            </li>
            <li>
              Failure to pay may result in suspension or termination of service.
            </li>
            <li>All fees are non-refundable except as required by law.</li>
          </ul>

          <h4>6.3 Cancellation</h4>
          <p>
            You may cancel your subscription at any time. Cancellation will take
            effect at the end of the current billing period.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>7. Termination</h3>
          <h4>7.1 Termination by User</h4>
          <p>
            You may terminate your account at any time by contacting us or using
            account settings. Parents may request deletion of their child's
            account at any time.
          </p>
          <h4>7.2 Termination by StudioPulse</h4>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms, engage in fraudulent activity, or pose a risk to the
            safety of minors or other users. We will provide notice of
            termination.
          </p>
          <h4>7.3 Effect of Termination</h4>
          <p>
            Upon termination, your access to the platform will cease. We may
            retain certain information as required by law or for legitimate
            business purposes, as described in our Privacy Policy.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>8. Disclaimers and Limitation of Liability</h3>
          <h4>8.1Service "As Is"</h4>
          <p>
            StudioPulse is provided "as is" without warranties of any kind,
            either express or implied. We do not guarantee uninterrupted,
            error-free, or secure service.
          </p>
          <h4>8.2 Educational Platform</h4>
          <p>
            StudioPulse is a platform for facilitating music education. We are
            not responsible for the quality of instruction, student progress, or
            educational outcomes. The relationship between teachers and students
            exists independently of the platform.
          </p>
          <h4>8.3 Limitation of Liability</h4>
          <p>
            To the maximum extent permitted by law, StudioPulse shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of the platform.
          </p>
        </section>

        <section className="legalPage__section">
          <h3>9. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless StudioPulse and its
            officers, directors, employees, and agents from any claims, damages,
            losses, or expenses arising from your violation of these Terms or
            misuse of the platform.
          </p>

          <h3>10. Changes to Terms</h3>
          <p>
            We may modify these Terms at any time. We will notify users of
            material changes via email or platform notification. Continued use
            of the platform after changes constitutes acceptance of the modified
            Terms.
          </p>

          <h3>11. Governing Law and Dispute Resolution</h3>
          <p>
            These Terms are governed by the laws of [Your Jurisdiction]. Any
            disputes shall be resolved through binding arbitration, except where
            prohibited by law. Parents acting on behalf of minors retain the
            right to bring claims in small claims court.
          </p>

          <h3>12. Contact Information</h3>
          <p>For questions about these Terms, please contact us at:</p>
          <p>
            <strong>StudioPulse</strong>
          </p>
          <p>Email: info@studiopulse.co</p>
          <p>
            Address: 2883 Hopyard Road, \#1049, Pleasanton, CA, 94588, United
            States
          </p>

          <h3>13. Miscellaneous</h3>
          <ul>
            <li>
              <strong>Severability:</strong> If any provision of these Terms is
              found unenforceable, the remaining provisions will remain in
              effect.
            </li>
            <li>
              <strong>Entire Agreement:</strong> These Terms constitute the
              entire agreement between you and StudioPulse.
            </li>
            <li>
              <strong>No Waiver:</strong> Our failure to enforce any right or
              provision does not constitute a waiver.
            </li>
            <li>
              <strong>Assignment:</strong> You may not assign these Terms
              without our consent. We may assign our rights and obligations.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
