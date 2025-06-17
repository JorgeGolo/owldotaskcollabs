import React from "react";

const privacypolicy = () => {
  return (
    <div className="mt-4 p-4 max-w-4xl mx-auto bg-white dark:bg-dark-2 shadow-md rounded-lg">
      <h1 className="pb-2 border-b-2">Privacy Policy</h1>

      <p>
        We value your privacy and are committed to protecting your personal
        data. This privacy policy explains how we collect, use, and protect the
        information we obtain through our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect personal information when users register on our site,
        complete questionnaires, or interact with our services. This may
        include:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Name and email address</li>
        <li>Authentication data when using Google Firebase Authentication</li>
        <li>Account preferences and settings</li>
        <li>Usage data and interaction with our services</li>
        <li>
          Device information including browser type, IP address, and operating
          system
        </li>
      </ul>

      <h2>2. Use of Information</h2>
      <p>The collected information is used to:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Create and manage user accounts</li>
        <li>Improve our services and user experience</li>
        <li>Provide personalized content and recommendations</li>
        <li>Send welcome emails and service notifications via Brevo</li>
        <li>Display relevant advertisements</li>
        <li>Detect and prevent fraud or misuse of our services</li>
        <li>Analyze usage patterns to enhance site functionaliy</li>
      </ul>

      <h2>3. Information Storage</h2>
      <p>User information is stored in:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Google Firebase Authentication system for account credentials</li>
        <li>Our external database for user preferences and activity data</li>
        <li>All data is protected using industry-standard security measures</li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>We utilize the following third-party services:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Google Firebase Authentication: For user registration and
          authentication. Please refer to{" "}
          <a
            className="text-blue-500 underline"
            href="https://policies.google.com/privacy"
          >
            Google's Privacy Policy
          </a>{" "}
          for details.
        </li>
        <li>
          Brevo: For sending welcome emails and notifications. Please refer to{" "}
          <a
            className="text-blue-500 underline"
            href="https://www.brevo.com/legal/privacypolicy/"
          >
            Brevo's Privacy Policy
          </a>{" "}
          for details.
        </li>
        <li>
          Google AdSense: For displaying advertisements. Please refer to{" "}
          <a
            className="text-blue-500 underline"
            href="https://policies.google.com/privacy"
          >
            Google's Privacy Policy
          </a>{" "}
          for details.
        </li>
      </ul>

      <h2>5. Ad Blocking Detection</h2>
      <p>
        Our website implements ad blocking detection technology. For
        authenticated users, we may request disabling of ad blockers to support
        our service through advertising revenue. This detection does not collect
        personal information but identifies if ad blocking software is being
        used.
      </p>

      <h2>6. Cookies and Similar Technologies</h2>
      <p>We use cookies and similar technologies to:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Remember user preferences and settings</li>
        <li>Understand how users interact with our services</li>
        <li>Authenticate users and maintain session information</li>
        <li>Deliver relevant advertisements</li>
        <li>Analyze site performance</li>
        <p>
          You can modify your browser settings to decline cookies, although this
          may affect certain functionalities of our service.
        </p>
      </ul>
      <h2>7. User Rights</h2>
      <p>You have the right to:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Access your personal data</li>
        <li>Correct inaccurate information</li>
        <li>Delete your personal data ("right to be forgotten")</li>
        <li>Object to certain types of processing</li>
        <li>Withdraw consent for optional data processing</li>
      </ul>
      <p>
        To exercise these rights, contact us at:{" "}
        <a href="mailto:info@owldotask.com" className="underline text-blue-500">
          info@owldotask.com
        </a>
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We retain personal data only for as long as necessary to provide our
        services and fulfill the purposes outlined in this policy, unless a
        longer retention period is required by law. .
      </p>

      <h2>9. Security Measures</h2>
      <p>
        We implement appropriate technical and organizational measures to
        protect your personal information against unauthorized access,
        alteration, disclosure, or destruction. .
      </p>

      <h2>10. Children's Privacy</h2>
      <p>
        Our services are not directed to individuals under the age of 13. We do
        not knowingly collect personal information from children under 13. If we
        discover that a child under 13 has provided us with personal
        information, we will promptly delete it.
      </p>

      <h2>11. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy periodically. We will notify users of any
        significant changes by posting a notice on our website or sending an
        email.
      </p>

      <h2>12. Contact Information</h2>
      <p>
        If you have questions about this privacy policy or our data practices,
        please contact us at{" "}
        <a href="mailto:info@owldotask.com" className="underline text-blue-500">
          info@owldotask.com
        </a>
      </p>

      <p className="text-sm italic mt-6">Last updated: March 25, 2024</p>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // No necesitas pasar props si no hay datos dinámicos
  };
}

export default privacypolicy;
