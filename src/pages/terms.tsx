import type { ReactNode } from 'react';
import LegalLayout, { LegalSection, type LegalSectionMeta } from '../components/LegalLayout';
import styles from './index.module.css';

const SECTIONS: LegalSectionMeta[] = [
  { id: 'acceptance', title: 'Acceptance' },
  { id: 'service-description-and-scope', title: 'Service Description and Scope' },
  { id: 'user-responsibilities-and-content', title: 'User Responsibilities and Content' },
  { id: 'account-management-and-security', title: 'Account Management and Security' },
  { id: 'fair-usage-and-service-limitations', title: 'Fair Usage and Service Limitations' },
  { id: 'data-handling-and-privacy', title: 'Data Handling and Privacy' },
  { id: 'intellectual-property-rights', title: 'Intellectual Property Rights' },
  { id: 'disclaimers-and-limitation-of-liability', title: 'Disclaimers and Limitation of Liability' },
  { id: 'governing-law-and-dispute-resolution', title: 'Governing Law and Dispute Resolution' },
  { id: 'general-provisions', title: 'General Provisions' },
];

/** Look sections up by id so the body and the table of contents cannot drift. */
const section = (id: string): LegalSectionMeta => SECTIONS.find((entry) => entry.id === id)!;

export default function Terms(): ReactNode {
  return (
    <LegalLayout
      title="Terms"
      description="The terms and conditions governing your access to and use of the Smartloop platform and related services."
      canonical="https://smartloop.ai/terms/"
      badge="Legal"
      heading="Terms and Conditions"
      effectiveDate="November 30, 2025"
      contactEmail="tos@smartloop.ai"
      lead="The agreement that governs your access to and use of the Smartloop platform and related services."
      sections={SECTIONS}
    >
      <div className={styles.legalIntro}>
        <p>
          These Terms and Conditions (the "<strong>Agreement</strong>") constitute a legally binding agreement between you ("<strong>User</strong>", "<strong>you</strong>", or "<strong>your</strong>") and Smartloop Inc., a corporation organized and existing under the laws of California ("<strong>Company</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>"), concerning your access to and use of the Smartloop platform and related services (the "<strong>Service</strong>").
        </p>
        <p>
          By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Agreement. If you do not agree to these terms, you must not access or use the Service.
        </p>
      </div>

      <LegalSection {...section('acceptance')}>
        <p>By creating an account, accessing, or using any part of the Service, you expressly acknowledge and agree to be bound by this Agreement and our <a href="/privacy">Privacy Policy</a>, which is incorporated herein by reference.</p>
        <p>This Agreement may be updated from time to time at our sole discretion. We will provide notice of material changes through the Service or via email. Your continued use of the Service after such notice constitutes acceptance of the modified terms.</p>
        <p>You represent and warrant that you have the legal authority to enter into this Agreement and that you are at least eighteen (18) years of age or the age of majority in your jurisdiction, whichever is greater.</p>
      </LegalSection>

      <LegalSection {...section('service-description-and-scope')}>
        <p>The Service provides an open-source, privacy-first platform for running AI assistants locally using Small Language Models (SLMs).</p>
        <p>The Service includes, but is not limited to: document processing, data vectorization, model fine-tuning capabilities, API access, and related infrastructure services.</p>
        <p>We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice to users.</p>
      </LegalSection>

      <LegalSection {...section('user-responsibilities-and-content')}>
        <p><strong>Content Ownership and Responsibility.</strong> You retain all rights, title, and interest in and to the content, data, and materials you upload, submit, or otherwise make available through the Service ("<strong>User Content</strong>").</p>
        <p><strong>Content Compliance.</strong> You represent and warrant that your User Content:</p>
        <ul>
          <li>Does not violate any applicable laws, regulations, or third-party rights</li>
          <li>Does not contain malicious code, viruses, or other harmful components</li>
          <li>Does not infringe upon intellectual property rights of any third party</li>
          <li>Does not contain personally identifiable information without proper authorization</li>
          <li>Complies with all applicable data protection and privacy laws</li>
        </ul>
        <p><strong>Indemnification.</strong> You agree to indemnify, defend, and hold harmless the Company from and against any claims, damages, losses, or expenses arising from your User Content or violation of this Agreement.</p>
      </LegalSection>

      <LegalSection {...section('account-management-and-security')}>
        <p><strong>Account Creation.</strong> To access certain features of the Service, you must create an account by providing accurate, complete, and current information.</p>
        <p><strong>Account Security.</strong> You are solely responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Immediately notifying us of any unauthorized access or security breaches</li>
        </ul>
        <p><strong>Account Termination.</strong> We reserve the right to suspend or terminate your account at our sole discretion for violation of this Agreement or for any other reason with reasonable notice.</p>
      </LegalSection>

      <LegalSection {...section('fair-usage-and-service-limitations')}>
        <p><strong>Fair Usage Policy.</strong> To ensure optimal performance and equitable access for all users, the Service is subject to fair usage limitations regarding:</p>
        <ul>
          <li>Data storage and processing capacity</li>
          <li>API request limits and rate limiting</li>
          <li>Computational resources and bandwidth utilization</li>
          <li>Model training and fine-tuning operations</li>
        </ul>
        <p><strong>Usage Monitoring.</strong> We monitor usage patterns and reserve the right to implement additional restrictions or require plan upgrades for users exceeding reasonable usage thresholds.</p>
        <p><strong>Service Availability.</strong> While we strive for high availability, we do not guarantee uninterrupted access to the Service and reserve the right to perform maintenance and updates.</p>
      </LegalSection>

      <LegalSection {...section('data-handling-and-privacy')}>
        <p><strong>Data Collection and Processing.</strong> Our collection, use, and processing of personal data is governed by our <a href="/privacy">Privacy Policy</a>, which forms an integral part of this Agreement.</p>
        <p><strong>Data Security Measures.</strong> We implement industry-standard security measures including:</p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Compliance with applicable data protection regulations</li>
        </ul>
        <p><strong>Data Retention and Deletion.</strong> We retain your data only as long as necessary to provide the Service or as required by applicable law. Upon account termination, we will delete or anonymize your data in accordance with our data retention policies.</p>
        <p><strong>Data Location and Transfer.</strong> Your data may be processed and stored in facilities located in the United States or other jurisdictions where we or our service providers operate.</p>
      </LegalSection>

      <LegalSection {...section('intellectual-property-rights')}>
        <p><strong>Company IP.</strong> The Service, including all software, technology, content, and materials provided by us, is protected by intellectual property laws and remains our exclusive property.</p>
        <p><strong>Limited License.</strong> Subject to this Agreement, we grant you a limited, non-exclusive, non-transferable license to access and use the Service for your internal business purposes.</p>
        <p><strong>User Content License.</strong> By uploading User Content, you grant us a limited license to process, store, and use such content solely for the purpose of providing the Service to you.</p>
      </LegalSection>

      <LegalSection {...section('disclaimers-and-limitation-of-liability')}>
        <p><strong>Service Disclaimer.</strong> The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
        <p><strong>Limitation of Liability.</strong> To the maximum extent permitted by law, in no event shall the Company be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.</p>
        <p><strong>Maximum Liability.</strong> Our total liability for any claims arising from or related to this Agreement shall not exceed the amount paid by you for the Service during the twelve (12) months preceding the claim.</p>
      </LegalSection>

      <LegalSection {...section('governing-law-and-dispute-resolution')}>
        <p><strong>Governing Law.</strong> This Agreement shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles.</p>
        <p><strong>Jurisdiction.</strong> Any disputes arising from this Agreement shall be resolved exclusively in the state and federal courts located in California, and you consent to the personal jurisdiction of such courts.</p>
        <p><strong>Alternative Dispute Resolution.</strong> Prior to initiating any legal proceedings, the parties agree to attempt to resolve disputes through good faith negotiations for a period of thirty (30) days.</p>
      </LegalSection>

      <LegalSection {...section('general-provisions')}>
        <p><strong>Entire Agreement.</strong> This Agreement, together with our Privacy Policy, constitutes the entire agreement between you and the Company regarding the Service.</p>
        <p><strong>Severability.</strong> If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
        <p><strong>Assignment.</strong> You may not assign or transfer your rights under this Agreement without our prior written consent. We may assign this Agreement without restriction.</p>
        <p><strong>Contact Information.</strong> For questions regarding this Agreement, please contact us at <a href="mailto:tos@smartloop.ai">tos@smartloop.ai</a>.</p>
      </LegalSection>
    </LegalLayout>
  );
}
