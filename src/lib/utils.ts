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

export const tailwindBreakpoints = {
	md: '48rem',
	lg: '64rem',
};

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
