import { type ReactNode } from 'react';
import Head from '@docusaurus/Head';
import { Redirect } from '@docusaurus/router';

/**
 * The support page was renamed to /contact. Kept as a redirect so existing
 * inbound links (and anything already indexed) keep working.
 */
export default function Support(): ReactNode {
  return (
    <>
      <Head>
        <title>Contact | Smartloop</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://smartloop.ai/contact/" />
        <meta httpEquiv="refresh" content="0; url=/contact/" />
      </Head>
      <Redirect to="/contact/" />
    </>
  );
}
