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
