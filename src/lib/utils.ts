import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export function capitalizeFirstLetter(val: string) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export async function processBlurb(blurb: string) {
	return await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(blurb);
}

export async function extractWorksCited(markdownString: string | undefined) {
	if (!markdownString) return;

	const worksCitedIndex = markdownString.indexOf('## Works Cited');
	if (worksCitedIndex === -1) return;

	const afterWorksCited = markdownString.substring(worksCitedIndex);

	return (
		await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(afterWorksCited)
	).toString();
}

export function hasGlosses(markdownString: string | undefined): boolean {
	if (!markdownString) return false;

	const worksCitedIndex = markdownString.indexOf('[+');
	return worksCitedIndex !== -1;
}

export function prettyDate(date: Date) {
	let str = new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date);
	return str.replace(/ /g, '-');
}

export function prettyDateLong(date: Date) {
	const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
	const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
	const day = date.getDate();
	const year = date.getFullYear();

	// Helper to get ordinal suffix
	function ordinal(n: number) {
		if (n > 3 && n < 21) return n + 'th';
		switch (n % 10) {
			case 1:
				return n + 'st';
			case 2:
				return n + 'nd';
			case 3:
				return n + 'rd';
			default:
				return n + 'th';
		}
	}

	return `${weekday}, ${month} ${ordinal(day)} ${year}`;
}
