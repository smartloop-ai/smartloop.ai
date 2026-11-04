import { useEffect, useState } from 'react';

import Head from '@docusaurus/Head';

import Header from '../components/Header';
import { isValidEmail } from '../utils/validation';

import styles from './index.module.css';
import { sendContactRequest, useApiBaseUrl } from '../utils/api';

const inputStyle: React.CSSProperties = {
	width: '100%',
	padding: '12px 16px',
	background: 'var(--sl-input-bg, #0d0d0f)',
	border: '1px solid var(--sl-input-border, #2a2a2e)',
	borderRadius: 'var(--sl-btn-radius, 4px)',
	color: 'var(--sl-input-fg, #e4e4e7)',
	fontSize: '0.9rem',
	outline: 'none',
	transition: 'border-color 0.2s',
	fontFamily: 'inherit',
};

const inputErrorStyle: React.CSSProperties = {
	...inputStyle,
	borderColor: '#ec4899',
};

const textareaStyle: React.CSSProperties = {
	...inputStyle,
	minHeight: '140px',
	resize: 'vertical',
	fontFamily: 'inherit',
};

const textareaErrorStyle: React.CSSProperties = {
	...textareaStyle,
	borderColor: '#ec4899',
};

export default function Contact() {
	const apiBaseUrl = useApiBaseUrl();
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		notes: "",
	});
	const [utmParams, setUtmParams] = useState<Record<string, string>>({});

	useEffect(() => {
		if (typeof window !== 'undefined' && !window.gtag) {
			window.gtag = function () {
				console.log('gtag not loaded yet');
			};
		}

		// Read UTM params from URL first, then fall back to sessionStorage
		const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
		const params = new URLSearchParams(window.location.search);
		const collected: Record<string, string> = {};
		utmKeys.forEach((key) => {
			const fromUrl = params.get(key);
			const fromSession = sessionStorage.getItem(key);
			const value = fromUrl || fromSession;
			if (value) {
				collected[key] = value;
				if (fromUrl) sessionStorage.setItem(key, fromUrl);
			}
		});
		setUtmParams(collected);
	}, []);

	const handleInput = (e: any) => {
		const fieldName = e.target.name;
		const fieldValue = e.target.value;

		setFormData((prevState) => ({
			...prevState,
			[fieldName]: fieldValue
		}));
	}

	const submitForm = async (e: any) => {
		e.preventDefault();

		setErrorMessage("");
		setSuccessMessage("");
		setDirty(true);

		if (formData.email.length === 0
			|| formData.name.length === 0
			|| formData.notes.length === 0) {
			return;
		}

		const email = formData.email.trim()

		if (!isValidEmail(email)) {
			setErrorMessage("Email address is invalid");
			return;
		}

		setIsLoading(true);

		try {
			await sendContactRequest(apiBaseUrl, {
				...utmParams,
				name: formData.name,
				email: email,
				notes: formData.notes,
			});

			setIsLoading(false);
			setSuccessMessage(`Contact request submitted successfully`);
			setFormData({ email: "", name: "", notes: "" });
			setDirty(false);
		} catch (err: any) {
			setIsLoading(false);
			setErrorMessage(err.message || "Failed to submit contact request, please try again later");
		}
	}

	const nameHasError = formData.name.length === 0 && dirty;
	const emailHasError = formData.email.length === 0 && dirty;
	const notesHasError = formData.notes.length === 0 && dirty;

	return (
		<div id="app" className="body">
			<Head>
				<title>Early Access | Smartloop</title>
				<meta name="description" content="Request early access to Smartloop — a local AI assistant that runs open models, reads your documents, and connects to your tools entirely on your own machine." />
				<meta property="og:title" content="Early Access | Smartloop" />
				<meta property="og:description" content="Request early access to Smartloop — a local AI assistant that runs open models, reads your documents, and connects to your tools entirely on your own machine." />
				<link rel="canonical" href="https://smartloop.ai/early-access/" />
			</Head>
			<div className="wrapper">
				<Header />
				<main className={styles.page}>
					<section className="flex flex-col items-center text-center px-6 pt-32 md:pt-40 pb-20">
						{successMessage.length > 0 && (
							<div className="text-emerald-400 text-sm mb-6 max-w-md">
								Thanks for reaching out. The team has been notified.
							</div>
						)}
						{errorMessage.length > 0 && (
							<div className="text-pink-500 text-sm mb-6">
								{errorMessage}
							</div>
						)}

						<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-zinc-100">New Contact Request</h1>
						<p className="text-zinc-400 max-w-md mb-2">
							Tell us how we can help, and the team will get back to you.
						</p>
						<p className="text-zinc-500 text-sm mb-10">
							All fields are required.
						</p>

						<form
							className="flex flex-col gap-5 w-full max-w-sm text-left"
							onSubmit={submitForm}
						>
							<div>
								<label className="block text-zinc-400 text-xs mb-2">Name</label>
								<input
									autoComplete="off"
									type="text"
									name="name"
									required
									placeholder="Your name"
									value={formData.name}
									onChange={handleInput}
									style={nameHasError ? inputErrorStyle : inputStyle}
								/>
							</div>
							<div>
								<label className="block text-zinc-400 text-xs mb-2">Email</label>
								<input
									autoComplete="off"
									type="email"
									name="email"
									required
									placeholder="you@company.com"
									value={formData.email}
									onChange={handleInput}
									style={emailHasError ? inputErrorStyle : inputStyle}
								/>
							</div>
							<div>
								<label className="block text-zinc-400 text-xs mb-2">Message</label>
								<textarea
									name="notes"
									required
									autoComplete="off"
									placeholder="How can we help? Share your question, request, or feedback"
									value={formData.notes}
									onChange={handleInput}
									style={notesHasError ? textareaErrorStyle : textareaStyle}
								/>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								style={{
									background: 'var(--sl-btn-accent, #ec4899)',
									border: '1px solid var(--sl-btn-accent, #ec4899)',
									color: 'white',
									fontWeight: 500,
									fontSize: '0.875rem',
									padding: '12px 24px',
									borderRadius: 'var(--sl-btn-radius, 4px)',
									cursor: isLoading ? 'not-allowed' : 'pointer',
									opacity: isLoading ? 0.6 : 1,
									transition: 'background 0.2s, box-shadow 0.2s',
									marginTop: '0.5rem',
								}}
							>
								{isLoading ? 'Submitting...' : 'Submit Request'}
							</button>
						</form>
					</section>
				</main>
			</div>
		</div>
	);
}
