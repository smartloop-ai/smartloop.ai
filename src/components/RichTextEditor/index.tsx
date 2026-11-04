import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import { sanitizeHtml } from '../../utils/sanitizeHtml';
import styles from '../../pages/index.module.css';

type Command = {
	id: string;
	label: string;
	title: string;
	/** execCommand name, or undefined for commands we apply by hand */
	command?: string;
	icon: ReactElement;
};

const BoldIcon = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 4h8a4 4 0 0 1 0 8H6z" />
		<path d="M6 12h9a4 4 0 0 1 0 8H6z" />
	</svg>
);

const ItalicIcon = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
		<line x1="19" y1="4" x2="10" y2="4" />
		<line x1="14" y1="20" x2="5" y2="20" />
		<line x1="15" y1="4" x2="9" y2="20" />
	</svg>
);

const BulletListIcon = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
		<line x1="9" y1="6" x2="20" y2="6" />
		<line x1="9" y1="12" x2="20" y2="12" />
		<line x1="9" y1="18" x2="20" y2="18" />
		<circle cx="4.5" cy="6" r="1.4" fill="currentColor" />
		<circle cx="4.5" cy="12" r="1.4" fill="currentColor" />
		<circle cx="4.5" cy="18" r="1.4" fill="currentColor" />
	</svg>
);

const NumberListIcon = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
		<line x1="10" y1="6" x2="20" y2="6" />
		<line x1="10" y1="12" x2="20" y2="12" />
		<line x1="10" y1="18" x2="20" y2="18" />
		<path d="M4 8V4l-1 .8" strokeWidth={1.8} />
		<path d="M3 12h2l-2 3h2" strokeWidth={1.8} />
		<path d="M3 17h2v3H3" strokeWidth={1.8} />
	</svg>
);

const CodeIcon = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
		<polyline points="16 18 22 12 16 6" />
		<polyline points="8 6 2 12 8 18" />
	</svg>
);

const LinkIcon = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
		<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
		<path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
	</svg>
);

const COMMANDS: Command[] = [
	{ id: 'bold', label: 'Bold', title: 'Bold (⌘B)', command: 'bold', icon: BoldIcon },
	{ id: 'italic', label: 'Italic', title: 'Italic (⌘I)', command: 'italic', icon: ItalicIcon },
	{ id: 'insertUnorderedList', label: 'Bulleted list', title: 'Bulleted list', command: 'insertUnorderedList', icon: BulletListIcon },
	{ id: 'insertOrderedList', label: 'Numbered list', title: 'Numbered list', command: 'insertOrderedList', icon: NumberListIcon },
	{ id: 'code', label: 'Code', title: 'Inline code', icon: CodeIcon },
	{ id: 'createLink', label: 'Link', title: 'Add link', icon: LinkIcon },
];

type Props = {
	value: string;
	onChange: (html: string) => void;
	placeholder?: string;
	hasError?: boolean;
	ariaLabel?: string;
	id?: string;
};

export default function RichTextEditor({
	value,
	onChange,
	placeholder,
	hasError,
	ariaLabel,
	id,
}: Props) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [activeCommands, setActiveCommands] = useState<Record<string, boolean>>({});
	const [isEmpty, setIsEmpty] = useState(true);

	/*
	 * contenteditable is uncontrolled: writing `value` back on every keystroke
	 * would reset the caret. The parent seeds it once, and clears the field by
	 * passing an empty string (see the effect below).
	 */
	useEffect(() => {
		const editor = editorRef.current;
		if (editor && value === '' && editor.innerHTML !== '') {
			editor.innerHTML = '';
			setIsEmpty(true);
		}
	}, [value]);

	const syncState = useCallback(() => {
		const editor = editorRef.current;
		if (!editor) return;

		setIsEmpty(editor.textContent?.trim().length === 0 && !editor.querySelector('li'));
		onChange(editor.innerHTML);
	}, [onChange]);

	const refreshActiveCommands = useCallback(() => {
		const editor = editorRef.current;
		if (!editor || document.activeElement !== editor) return;

		const next: Record<string, boolean> = {};
		COMMANDS.forEach(({ id: commandId, command }) => {
			if (!command) return;
			try {
				next[commandId] = document.queryCommandState(command);
			} catch {
				next[commandId] = false;
			}
		});
		setActiveCommands(next);
	}, []);

	useEffect(() => {
		document.addEventListener('selectionchange', refreshActiveCommands);
		return () => document.removeEventListener('selectionchange', refreshActiveCommands);
	}, [refreshActiveCommands]);

	/** Wrap the selection in <code>, since execCommand has no inline-code command. */
	const applyCode = () => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

		const range = selection.getRangeAt(0);
		const code = document.createElement('code');
		try {
			range.surroundContents(code);
		} catch {
			// Selection spans element boundaries — fall back to extracting it.
			code.appendChild(range.extractContents());
			range.insertNode(code);
		}
		selection.removeAllRanges();
	};

	const applyLink = () => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) {
			window.alert('Select the text you want to turn into a link first.');
			return;
		}

		const url = window.prompt('Link URL', 'https://');
		if (!url) return;

		if (!/^(https?:\/\/|mailto:)/i.test(url)) {
			window.alert('Links must start with http://, https:// or mailto:');
			return;
		}
		document.execCommand('createLink', false, url);
	};

	const runCommand = (command: Command) => {
		editorRef.current?.focus();

		if (command.id === 'code') {
			applyCode();
		} else if (command.id === 'createLink') {
			applyLink();
		} else if (command.command) {
			/*
			 * execCommand is deprecated but remains the only cross-browser way to
			 * do this without pulling in an editor framework, and every engine we
			 * target still implements it.
			 */
			document.execCommand(command.command);
		}

		syncState();
		refreshActiveCommands();
	};

	/** Paste as plain text so foreign markup never enters the document. */
	const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
		event.preventDefault();
		const text = event.clipboardData.getData('text/plain');
		document.execCommand('insertText', false, text);
		syncState();
	};

	const handleBlur = () => {
		const editor = editorRef.current;
		if (!editor) return;

		// Normalise whatever the browser produced before it leaves the field.
		const clean = sanitizeHtml(editor.innerHTML);
		if (clean !== editor.innerHTML) {
			editor.innerHTML = clean;
		}
		onChange(clean);
	};

	return (
		<div className={`${styles.richEditor} ${hasError ? styles.contactInputError : ''}`}>
			<div className={styles.richToolbar} role="toolbar" aria-label="Formatting">
				{COMMANDS.map((command) => (
					<button
						key={command.id}
						type="button"
						title={command.title}
						aria-label={command.label}
						aria-pressed={activeCommands[command.id] ?? false}
						className={`${styles.richToolbarBtn} ${activeCommands[command.id] ? styles.richToolbarBtnActive : ''}`}
						// Keep the selection alive when the button takes focus
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => runCommand(command)}
					>
						{command.icon}
					</button>
				))}
			</div>
			<div
				id={id}
				ref={editorRef}
				className={styles.richEditorBody}
				contentEditable
				suppressContentEditableWarning
				role="textbox"
				aria-multiline="true"
				aria-label={ariaLabel}
				data-placeholder={placeholder}
				data-empty={isEmpty}
				onInput={syncState}
				onPaste={handlePaste}
				onBlur={handleBlur}
			/>
		</div>
	);
}
