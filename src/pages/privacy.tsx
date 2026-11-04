import type { ReactNode } from 'react';
import LegalLayout, { LegalSection, type LegalSectionMeta } from '../components/LegalLayout';
import styles from './index.module.css';

const SECTIONS: LegalSectionMeta[] = [
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-your-information', title: 'How We Use Your Information' },
  { id: 'local-processing', title: 'Local Processing' },
  { id: 'data-sharing-and-disclosure', title: 'Data Sharing and Disclosure' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'cookies-and-tracking', title: 'Cookies and Tracking' },
  { id: 'third-party-links', title: 'Third-Party Links' },
  { id: 'children-s-privacy', title: "Children's Privacy" },
  { id: 'international-data-transfers', title: 'International Data Transfers' },
  { id: 'changes-to-this-policy', title: 'Changes to This Policy' },
  { id: 'contact-us', title: 'Contact Us' },
];

/** Look sections up by id so the body and the table of contents cannot drift. */
const section = (id: string): LegalSectionMeta => SECTIONS.find((entry) => entry.id === id)!;

export default function Privacy(): ReactNode {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How Smartloop collects, uses, and protects your personal information."
      canonical="https://smartloop.ai/privacy/"
      badge="Legal"
      heading="Privacy Policy"
      effectiveDate="November 30, 2025"
      contactEmail="privacy@smartloop.ai"
      lead="How we collect, use, and protect your information — and why most of your data never leaves your machine."
      sections={SECTIONS}
    >
      <div className={styles.legalIntro}>
        <p>
          This Privacy Policy describes how Smartloop Inc. ("<strong>Company</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") collects, uses, and protects your personal information when you use the Smartloop platform and related services (the "<strong>Service</strong>").
        </p>
      </div>

      <LegalSection {...section('information-we-collect')}>
        <p>
          <strong>Account Information.</strong> When you create an account using Google Sign-In, we collect the basic profile information provided by Google, including:
        </p>
        <ul>
          <li>Name and email address</li>
          <li>Profile picture (if available)</li>
        </ul>
        <p>
          <strong>Payment Information.</strong> Billing and payment processing is handled entirely by <a href="https://stripe.com">Stripe</a>. We do not collect, store, or have access to your full credit card number or payment details. Stripe may collect information necessary to process your transactions in accordance with their own <a href="https://stripe.com/privacy">Privacy Policy</a>.
        </p>
        <p>
          <strong>User Content.</strong> Documents, files, and data you use with Smartloop are processed locally on your device. We do <strong>not</strong> collect, receive, or store your User Content — it never leaves your machine unless you explicitly choose to use a cloud model, in which case the relevant content is sent to that third-party provider to perform the processing you request.
        </p>
      </LegalSection>

      <LegalSection {...section('how-we-use-your-information')}>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve the Service</li>
          <li>Process your transactions and manage your account</li>
          <li>Communicate with you about updates, security alerts, and support</li>
          <li>Comply with legal obligations and enforce our terms</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal information to third parties.</p>
      </LegalSection>

      <LegalSection {...section('local-processing')}>
        <p>Smartloop is designed with privacy at its core. When you use Smartloop locally:</p>
        <ul>
          <li><strong>On-device processing.</strong> Documents and data processed using local models remain entirely on your machine. No data is sent to external servers unless you explicitly choose to use a cloud model, in which case the relevant content is sent to that third-party provider to perform the processing you request.</li>
          <li><strong>No telemetry by default.</strong> Local installations do not collect or transmit usage data unless you explicitly opt in.</li>
          <li><strong>Your data, your control.</strong> Files and models stored locally are accessible only to you and are never shared with us or any third party.</li>
        </ul>
      </LegalSection>

      <LegalSection {...section('data-sharing-and-disclosure')}>
        <p>We may share your information only in the following circumstances:</p>
        <ul>
          <li><strong>Service Providers.</strong> With trusted third-party vendors who assist in operating the Service (e.g., hosting, payment processing via Stripe), subject to confidentiality obligations.</li>
          <li><strong>Legal Requirements.</strong> When required by law, regulation, or legal process, or to protect the rights, property, or safety of the Company, our users, or the public.</li>
          <li><strong>Business Transfers.</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
          <li><strong>With Your Consent.</strong> When you explicitly authorize us to share your information.</li>
        </ul>
      </LegalSection>

      <LegalSection {...section('data-security')}>
        <p>We implement industry-standard security measures to protect your information, including:</p>
        <ul>
          <li>Encryption of data in transit (TLS) and at rest</li>
          <li>Access controls and role-based permissions</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Secure infrastructure hosted with reputable cloud providers</li>
        </ul>
        <p>While we strive to protect your information, no method of transmission or storage is completely secure. We cannot guarantee absolute security.</p>
      </LegalSection>

      <LegalSection {...section('data-retention')}>
        <p>We retain your personal information only as long as necessary to:</p>
        <ul>
          <li>Provide the Service and fulfill the purposes described in this Policy</li>
          <li>Comply with legal, accounting, or reporting obligations</li>
          <li>Resolve disputes and enforce our agreements</li>
        </ul>
        <p>Upon account deletion, we will remove or anonymize your personal data within thirty (30) days, except where retention is required by law.</p>
      </LegalSection>

      <LegalSection {...section('your-rights')}>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li><strong>Access</strong> the personal information we hold about you</li>
          <li><strong>Correct</strong> inaccurate or incomplete information</li>
          <li><strong>Delete</strong> your personal information</li>
          <li><strong>Export</strong> your data in a portable format</li>
          <li><strong>Opt out</strong> of marketing communications</li>
          <li><strong>Restrict</strong> or object to certain processing activities</li>
        </ul>
        <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@smartloop.ai">privacy@smartloop.ai</a>.</p>
      </LegalSection>

      <LegalSection {...section('cookies-and-tracking')}>
        <p>Our website may use cookies and similar technologies to:</p>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Analyze site traffic and usage patterns</li>
          <li>Improve site performance and user experience</li>
        </ul>
        <p>You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of the Service.</p>
      </LegalSection>

      <LegalSection {...section('third-party-links')}>
        <p>The Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.</p>
      </LegalSection>

      <LegalSection {...section('children-s-privacy')}>
        <p>The Service is not intended for children under the age of thirteen (13). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
      </LegalSection>

      <LegalSection {...section('international-data-transfers')}>
        <p>Your information may be processed and stored in the United States or other jurisdictions where we or our service providers operate. By using the Service, you consent to the transfer of your information to these jurisdictions, which may have different data protection laws than your country of residence.</p>
      </LegalSection>

      <LegalSection {...section('changes-to-this-policy')}>
        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website or through the Service. Your continued use of the Service after such changes constitutes acceptance of the updated policy.</p>
      </LegalSection>

      <LegalSection {...section('contact-us')}>
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:privacy@smartloop.ai">privacy@smartloop.ai</a>.</p>
      </LegalSection>
    </LegalLayout>
  );
}
