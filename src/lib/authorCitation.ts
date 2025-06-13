import type { Author } from '../content.config.ts';

/**
 * Splits a full name into given/middle names and last name.
 * Assumes the last whitespace-delimited token is the surname.
 */
function splitName(fullName: string): { firstAndMiddles: string; last: string } {
	const parts = fullName.trim().split(/\s+/);
	const last = parts.pop()!;
	const firstAndMiddles = parts.join(' ');
	return { firstAndMiddles, last };
}

/**
 * Formats an array of authors into a citation string:
 * - 1 author:  "Last, First Middle"
 * - 2 authors: "Last1, First1 Middle1, and First2 Middle2 Last2"
 * - 3+ authors:"Last1, First1 Middle1, et. al."
 *
 * @param authors Array of { title: full name }
 * @returns properly formatted citation
 */
function formatAuthorCitation(authors: Author[]): string {
	if (!Array.isArray(authors) || authors.length === 0) {
		return '';
	}

	const count = authors.length;

	if (count === 1) {
		const { firstAndMiddles, last } = splitName(authors[0].data.title);
		return `${last}, ${firstAndMiddles}`;
	}

	if (count === 2) {
		const a1 = splitName(authors[0].data.title);
		const a2 = splitName(authors[1].data.title);
		return `${a1.last}, ${a1.firstAndMiddles} and ${a2.firstAndMiddles} ${a2.last}`;
	}

	// three or more
	const first = splitName(authors[0].data.title);
	return `${first.last}, ${first.firstAndMiddles}, et. al.`;
}

export default formatAuthorCitation;
