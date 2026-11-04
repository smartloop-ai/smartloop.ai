import { useEffect, useState, type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';

import Header from '../Header';
import Footer from '../Footer';
import styles from '../../pages/index.module.css';

export type LegalSectionMeta = {
	id: string;
	title: string;
};

/** Highlights the section currently in view in the sidebar table of contents. */
function useActiveSection(sections: LegalSectionMeta[]): string {
	const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

	useEffect(() => {
		const headings = sections
			.map(({ id }) => document.getElementById(id))
			.filter((element): element is HTMLElement => element !== null);

		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible.length > 0) {
					setActiveId(visible[0].target.id);
				}
			},
			// Bias the band towards the top of the viewport, under the fixed header.
			{ rootMargin: '-88px 0px -70% 0px', threshold: 0 },
		);

		headings.forEach((heading) => observer.observe(heading));
		return () => observer.disconnect();
	}, [sections]);

	return activeId;
}

type LegalSectionProps = LegalSectionMeta & {
	children: ReactNode;
};

export function LegalSection({ id, title, children }: LegalSectionProps) {
	return (
		<section id={id} className={styles.legalSection}>
			<h2 className={styles.legalSectionTitle}>
				{title}
				<a href={`#${id}`} className={styles.legalAnchor} aria-label={`Link to ${title}`}>
					#
				</a>
			</h2>
			{children}
		</section>
	);
}

type Props = {
	/** Browser/tab title, e.g. "Terms" */
	title: string;
	description: string;
	canonical: string;
	badge: string;
	heading: string;
	effectiveDate: string;
	lead: ReactNode;
	sections: LegalSectionMeta[];
	/** Where questions about this document should go */
	contactEmail: string;
	children: ReactNode;
};

export default function LegalLayout({
	title,
	description,
	canonical,
	badge,
	heading,
	effectiveDate,
	lead,
	sections,
	contactEmail,
	children,
}: Props) {
	const activeId = useActiveSection(sections);

	return (
		<div id="app" className="body">
			<Head>
				<title>{title} | Smartloop</title>
				<meta name="description" content={description} />
				<meta property="og:title" content={`${title} | Smartloop`} />
				<meta property="og:description" content={description} />
				<link rel="canonical" href={canonical} />
			</Head>
			<div className="wrapper">
				<Header />
				<main className={styles.page}>
					<section className="px-6 pt-28 md:pt-36 pb-10 max-w-5xl mx-auto w-full">
						<span className={styles.comingSoonBadge}>{badge}</span>
						<h1 className={styles.legalTitle}>{heading}</h1>
						<p className={styles.legalLead}>{lead}</p>
						<div className={styles.legalMeta}>
							<span className={styles.legalMetaPill}>Effective {effectiveDate}</span>
							<a href={`mailto:${contactEmail}`} className={styles.legalMetaLink}>
								{contactEmail}
							</a>
						</div>
					</section>

					<section className="px-6 pb-20 max-w-5xl mx-auto w-full">
						<div className={styles.legalGrid}>
							<nav className={styles.legalToc} aria-label="On this page">
								<p className={styles.legalTocLabel}>On this page</p>
								<ol className={styles.legalTocList}>
									{sections.map((section) => (
										<li key={section.id}>
											<a
												href={`#${section.id}`}
												className={`${styles.legalTocLink} ${activeId === section.id ? styles.legalTocLinkActive : ''}`}
												aria-current={activeId === section.id ? 'true' : undefined}
											>
												{section.title}
											</a>
										</li>
									))}
								</ol>
							</nav>

							<article className={styles.legalProse}>{children}</article>
						</div>
					</section>

					<section className="px-6 pb-16 max-w-5xl mx-auto w-full">
						<div className={styles.legalFooterCard}>
							<div>
								<h2 className={styles.legalFooterTitle}>Questions about this document?</h2>
								<p className={styles.legalFooterDesc}>
									Write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>, or reach the team
									through the contact form.
								</p>
							</div>
							<Link to="/contact/" className={styles.legalFooterCta}>
								Contact us
							</Link>
						</div>
					</section>

					<Footer />
				</main>
			</div>
		</div>
	);
}
