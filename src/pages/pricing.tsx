import { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './index.module.css';

const plans = [
  {
    name: 'Free',
    badge: null as string | null,
    desc: 'For individuals running Smartloop locally — no account or credit card needed.',
    features: [
      'Curated, capable models',
      'Orchestration comparable to large models',
      'Documents, tools and skills',
      '100% local & private',
      'Monthly AI search allowance — buy more from your dashboard',
    ],
    featuresLabel: 'Included in Free',
    price: 'Free',
    priceLabel: '',
    cta: 'Download now',
    ctaHref: '/download',
    featured: false,
  },
  // Enterprise sells services, not a license: Smartloop itself stays free at
  // any scale. Extra search credits are bought from the dashboard
  // (app.smartloop.ai), not sold here.
  {
    name: 'Enterprise',
    badge: 'For teams' as string | null,
    desc: 'Smartloop stays free at any scale. Hire us to set it up and get it working on your data.',
    features: [
      'Rollout across your team',
      'Setting up your local AI infrastructure',
      'Models fine-tuned on your data',
      'Ongoing updates and maintenance',
    ],
    featuresLabel: 'Everything in Free, plus:',
    price: 'Custom',
    priceLabel: '',
    cta: 'Contact us',
    ctaHref: '/contact/',
    featured: true,
  },
];

export default function Pricing(): ReactNode {
  return (
    <div id="app" className="body">
      <Head>
        <title>Pricing | Smartloop</title>
        <meta name="description" content="Smartloop pricing — free for individuals and enterprises running Smartloop locally. Hire us to set it up, deploy on-premise, and tune it on your data." />
        <meta property="og:title" content="Pricing | Smartloop" />
        <meta property="og:description" content="Smartloop pricing — free for individuals and enterprises running Smartloop locally. Hire us to set it up, deploy on-premise, and tune it on your data." />
        <link rel="canonical" href="https://smartloop.ai/pricing/" />
      </Head>
      <div className="wrapper">
        <Header />
        <main className={styles.page}>
          {/* Hero */}
          <section className="flex flex-col items-center text-center px-6 pt-28 md:pt-36 pb-6 max-w-5xl mx-auto w-full">
            <h1 className={`text-3xl md:text-5xl mb-4 leading-tight ${styles.heroTitle}`}>Start for Free</h1>
            <p className="text-zinc-400 max-w-xl">
              Free for individuals and enterprises alike — no account or credit card needed. Hire us to set it up and get it working for you.
            </p>
          </section>

          {/* Plans */}
          <section className="px-6 pt-6 pb-6 max-w-4xl mx-auto w-full">
            <div className={styles.pricingGrid}>
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`${styles.planCard} ${plan.featured ? styles.planCardFeatured : ''}`}
                >
                  <div className={styles.planHeader}>
                    <h2 className={styles.planName}>{plan.name}</h2>
                    {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
                  </div>
                  <div className={styles.planPrice}>
                    <span className={styles.planPriceAmount}>{plan.price}</span>
                    <span className={styles.planPriceUnit}>{plan.priceLabel}</span>
                  </div>
                  <p className={styles.planDesc}>{plan.desc}</p>
                  <div className={styles.planCtaRow}>
                    <Link
                      to={plan.ctaHref}
                      className={`${styles.planCta} ${plan.featured ? styles.planCtaFeatured : ''}`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                  <p className={styles.planFeaturesLabel}>{plan.featuresLabel}</p>
                  <ul className={styles.planFeatures}>
                    {plan.features.filter(Boolean).map((feature) => (
                      <li key={feature} className={styles.planFeature}>
                        <span className={styles.planFeatureCheck} aria-hidden="true">[x]</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Search privacy */}
          <section className="px-6 pb-14 max-w-4xl mx-auto w-full">
            <p className={styles.pricingNote}>
              AI search uses search providers only to find links; the pages are fetched and ranked on your machine. Only the query leaves it — never your documents or conversations — and we do not store it; the only thing counted is the search itself. Every account gets a monthly allowance, and you can buy more from your <a href="https://app.smartloop.ai/settings/websearch/" className="underline">dashboard</a>. See <Link to="/docs/web-search#privacy" className="underline">privacy</Link> for details.
            </p>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
