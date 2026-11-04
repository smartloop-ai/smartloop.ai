/**
 * Allowlist sanitizer for the rich text field on the contact form.
 *
 * The submitted markup is interpolated into an outgoing email on the server, so
 * everything outside this small formatting subset is dropped. The server
 * applies its own allowlist as well — this one only keeps the payload clean for
 * well-behaved clients.
 */

const ALLOWED_TAGS = new Set([
	'B', 'STRONG', 'I', 'EM', 'U', 'CODE', 'BR', 'P', 'DIV', 'UL', 'OL', 'LI', 'A',
]);

/** Anchors are the only tag carrying an attribute, and only these schemes. */
const ALLOWED_HREF = /^(https?:\/\/|mailto:)/i;

function sanitizeNode(node: Node, doc: Document): Node[] {
	if (node.nodeType === Node.TEXT_NODE) {
		return [doc.createTextNode(node.textContent ?? '')];
	}

	if (node.nodeType !== Node.ELEMENT_NODE) {
		return [];
	}

	const element = node as Element;
	const children = Array.from(element.childNodes).flatMap((child) => sanitizeNode(child, doc));

	if (!ALLOWED_TAGS.has(element.tagName)) {
		// Unwrap: keep the text the user typed, drop the disallowed element.
		return children;
	}

	const clean = doc.createElement(element.tagName.toLowerCase());

	if (element.tagName === 'A') {
		const href = element.getAttribute('href') ?? '';
		if (!ALLOWED_HREF.test(href)) {
			return children;
		}
		clean.setAttribute('href', href);
		clean.setAttribute('rel', 'noopener noreferrer');
	}

	children.forEach((child) => clean.appendChild(child));
	return [clean];
}

export function sanitizeHtml(html: string): string {
	if (typeof window === 'undefined' || !html) {
		return '';
	}

	const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
	const container = doc.createElement('div');
	Array.from(doc.body.childNodes)
		.flatMap((node) => sanitizeNode(node, doc))
		.forEach((node) => container.appendChild(node));

	return container.innerHTML;
}

/** Text content of the markup, used for the "is this field empty?" check. */
export function htmlToPlainText(html: string): string {
	if (typeof window === 'undefined' || !html) {
		return '';
	}

	const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
	return (doc.body.textContent ?? '').replace(/ /g, ' ').trim();
}
