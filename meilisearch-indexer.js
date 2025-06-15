// meili-indexer.js
// Run this script from your project root (e.g., `node ./scripts/meili-indexer.js`)

import { MeiliSearch } from 'meilisearch';
import { remark } from 'remark';
import strip from 'strip-markdown';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

// --- Configuration ---
const MEILI_HOST = process.env.MEILI_HOST || 'https://search.electronicbookreview.com/';
const MEILI_API_KEY = process.env.MEILI_API_KEY || 'pkzVmuJ26vmwLqtz2qJxWA6z';
const MEILI_INDEX_NAME = 'journal';
const SITE_BASE_URL = 'https://electronicbookreview.com';
// const CONTENT_DIR = path.resolve('./src/content');
const CONTENT_DIR = path.resolve('/home/colin/WebstormProjects/ebr-content/');

// --- Initialize Meilisearch Client ---
const client = new MeiliSearch({
	host: MEILI_HOST,
	apiKey: MEILI_API_KEY,
});

// --- Helper to convert Markdown to plain text ---
async function markdownToText(markdownContent) {
	if (!markdownContent) return '';
	const file = await remark().use(strip).process(markdownContent);
	return String(file);
}

// --- Helper to read and parse markdown files from the filesystem ---
/**
 * @typedef {Object} MarkdownDoc
 * @property {string} id - The unique identifier for the document (e.g., 'folder/filename-without-ext').
 * @property {string} slug - The slug for URL generation, typically same as id.
 * @property {Record<string, any>} data - Parsed frontmatter content.
 * @property {string} body - Raw Markdown content (after frontmatter).
 * @property {string} collection - Name of the collection.
 */

/**
 * Reads all markdown files from a given collection path, parses frontmatter and content.
 * @param {string} collectionName - The name of the collection (e.g., 'authors', 'posts').
 * @param {string} globPatternInContentDir - Glob pattern relative to CONTENT_DIR (e.g., 'authors/* /*.md').
 * @param {string} collectionSubDir - The subdirectory for this collection relative to CONTENT_DIR (e.g., 'authors'). Used to calculate relative IDs.
 * @returns {Promise<MarkdownDoc[]>} An array of parsed markdown documents.
 */
async function getFilesForCollection(collectionName, globPatternInContentDir, collectionSubDir) {
	const fullGlobPattern = path.join(CONTENT_DIR, globPatternInContentDir).replace(/\\/g, '/');

	const filePaths = await glob(fullGlobPattern);
	const documents = [];

	for (const filePath of filePaths) {
		try {
			const fileContent = await fs.readFile(filePath, 'utf-8');
			let { data, content: body } = matter(fileContent);

			// pull out fields we dont need for search
			const { draft, modified_date, post_id, doi, ...dataClean } = data;

			let collectionRealName = collectionName==='posts' ? 'publications' : collectionName;
			documents.push({
				id: generateSafeId(collectionName, data.slug),
				url: `${SITE_BASE_URL}/${collectionRealName}/${data.slug}`,
				data: dataClean,
				body,
				collection: collectionName,
			});
		} catch (error) {
			console.error(`Error processing file ${filePath}:`, error);
		}
	}
	return documents;
}

function generateSafeId(collectionName, slug) {
	// 1. Replace any character that isn’t a letter/number/underscore/hyphen with a hyphen
	const sanitize = (s) =>
		s.replace(/[^A-Za-z0-9_-]/g, "-");

	const cleanCollection = sanitize(collectionName);
	let cleanSlug       = sanitize(slug);
	const separator     = "__";
	let id              = `${cleanCollection}${separator}${cleanSlug}`;

	// 2. If it’s already under 400 bytes, we’re done
	const encoder = new TextEncoder();
	if (encoder.encode(id).length <= 400) {
		return id;
	}

	// 3. Otherwise, truncate the slug part so the whole thing fits in 400 bytes
	//    (since after sanitization every character is ASCII, 1 byte each,
	//     we can safely slice by character count)
	const maxSlugChars = 400 - encoder.encode(cleanCollection + separator).length;
	cleanSlug = cleanSlug.slice(0, maxSlugChars);
	return `${cleanCollection}${separator}${cleanSlug}`;
}

// --- Helper to resolve author references ---
async function resolveAuthorNames(authorRefs, allAuthorsData) {
	if (!authorRefs || authorRefs.length === 0) return [];
	return authorRefs.map(ref => {
		if (typeof ref !== 'string') {
			console.warn('Author reference found without a valid ID structure. Expected { id: "string" } got:', ref);
			return 'Unknown Author (malformed ref)';
		}
		const authorId = ref;
		const author = allAuthorsData.find(a => a.data.slug === authorId);
		if(!author) {
			throw new Error(`Author with ID ${authorId} not found in authors data.`);
		}
		return author.data.title;
	});
}

// --- Main Indexing Function ---
async function indexContent() {
	console.log(`Starting indexing for Meilisearch index: ${MEILI_INDEX_NAME}`);

	const documents = [];

	// 1. Fetch all authors first for easy lookup
	const rawAuthors = await getFilesForCollection('authors', 'authors/*/*.md', 'authors');
	const allAuthorsData = await Promise.all(rawAuthors.map(async authorDoc => ({
		...authorDoc,
		bodyContent: await markdownToText(authorDoc.body),
	})));

	for (const author of allAuthorsData) {
		documents.push({
			id: author.id,
			content_type: 'author',
			title: author.data.title,
			slug: author.data.slug,
			url: author.url,
			publish_date: author.data.publish_date ? Math.floor(new Date(author.data.publish_date).getTime() / 1000) : undefined,
			body: author.bodyContent,
		});
	}
	console.log(`Prepared ${rawAuthors.length} author documents.`);

	// 2. Index Posts
	const rawPosts = await getFilesForCollection('posts', 'posts/*/*.md', 'posts');
	for (const post of rawPosts) {
		if (post.data.draft && process.env.NODE_ENV === 'production') {
			console.log(`Skipping draft post: ${post.id}`);
			continue;
		}
		const authorNames = await resolveAuthorNames(post.data.authors, allAuthorsData);
		const bodyContent = await markdownToText(post.body);

		documents.push({
			id: post.id,
			content_type: 'post',
			title: post.data.title,
			slug: post.data.slug,
			url: post.url,
			publish_date: post.data.publish_date ? Math.floor(new Date(post.data.publish_date).getTime() / 1000) : undefined,
			post_type: post.data.type,
			thread: post.data.thread,
			peer_reviewed: post.data.peer_reviewed,
			authors: authorNames,
			blurb: post.data.blurb,
			image: post.data.image,
			body: bodyContent,
		});
	}
	console.log(`Prepared ${rawPosts.length} post documents (after draft filtering).`);

	// 3. Index Gatherings
	const rawGatherings = await getFilesForCollection('gatherings', 'gatherings/*.md', 'gatherings');
	for (const gathering of rawGatherings) {
		if (gathering.data.draft && process.env.NODE_ENV === 'production') {
			console.log(`Skipping draft gathering: ${gathering.id}`);
			continue;
		}
		const authorNames = await resolveAuthorNames(gathering.data.authors, allAuthorsData);
		const bodyContent = await markdownToText(gathering.body);

		documents.push({
			id: gathering.id,
			content_type: 'gathering',
			title: gathering.data.title,
			slug: gathering.data.slug,
			url: gathering.url,
			publish_date: gathering.data.publish_date ? Math.floor(new Date(gathering.data.publish_date).getTime() / 1000) : undefined,
			authors: authorNames,
			image: gathering.data.image,
			body: bodyContent,
		});
	}
	console.log(`Prepared ${rawGatherings.length} gathering documents (after draft filtering).`);

	// 4. Index Newsletters
	const rawNewsletters = await getFilesForCollection('newsletters', 'newsletters/*.md', 'newsletters');
	for (const newsletter of rawNewsletters) {
		if (newsletter.data.draft && process.env.NODE_ENV === 'production') {
			console.log(`Skipping draft newsletter: ${newsletter.id}`);
			continue;
		}
		const authorNames = await resolveAuthorNames(newsletter.data.authors, allAuthorsData);
		const bodyContent = await markdownToText(newsletter.body);

		documents.push({
			id: newsletter.id,
			content_type: 'newsletter',
			title: newsletter.data.title,
			slug: newsletter.data.slug,
			url: newsletter.url,
			publish_date: newsletter.data.publish_date ? Math.floor(new Date(newsletter.data.publish_date).getTime() / 1000) : undefined,
			authors: authorNames,
			body: bodyContent,
		});
	}
	console.log(`Prepared ${rawNewsletters.length} newsletter documents (after draft filtering).`);

	// --- Send to Meilisearch ---
	if (documents.length > 0) {
		console.log(`Sending ${documents.length} documents to Meilisearch...`);
		try {
			await client.getIndex(MEILI_INDEX_NAME);
		} catch (e) {
			if (e.cause.code === 'index_not_found') {
				console.log(`Index ${MEILI_INDEX_NAME} not found. Creating...`);
				await client.createIndex(MEILI_INDEX_NAME, { primaryKey: 'id' });
			} else {
				console.error('Error checking/creating Meilisearch index:', e);
				throw e;
			}
		}

		const BATCH_SIZE = 500;
		console.log(`Adding/updating documents in batches of ${BATCH_SIZE}...`);
		for (let i = 0; i < documents.length; i += BATCH_SIZE) {
			const batch = documents.slice(i, i + BATCH_SIZE);
			try {
				const task = await client.index(MEILI_INDEX_NAME).addDocuments(batch, { primaryKey: 'id' });
				console.log(`Batch ${Math.floor(i/BATCH_SIZE) + 1} sent. Task UID: ${task.taskUid}`);

				let status = task.status;
				while( status === 'enqueued' || status === 'processing') {
					await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before checking again
					const updatedTask = await client.tasks.getTask(task.taskUid);
					status = updatedTask.status;
					console.log(updatedTask);
				}

			} catch (error) {
				console.error(`Error sending batch ${Math.floor(i/BATCH_SIZE) + 1} to Meilisearch:`, error);
			}
		}
		console.log('All document batches sent to Meilisearch.');
	} else {
		console.log('No documents to send.');
	}

	// --- Configure Meilisearch Index Settings ---
	console.log('Configuring Meilisearch index settings...');
	try {
		const settingsTask = await client.index(MEILI_INDEX_NAME).updateSettings({
			searchableAttributes: [
				'title',
				'body',
				'blurb',
				'authors',
			],
			filterableAttributes: [
				'content_type',
				'post_type',
				'thread',
				'peer_reviewed',
				'authors',
				'publish_date'
			],
			sortableAttributes: [
				'publish_date',
				'title'
			],
			rankingRules: [
				'words',
				'typo',
				'proximity',
				'attribute',
				'sort',
				'exactness',
				'publish_date:desc',
			],
			synonyms: {
				'ai': ['artificial intelligence'],
				'cdn': ['center for digital narrative'],
				'uib': ['university of bergen'],
			}
		});

		console.log(`Waiting for settings update task (UID: ${settingsTask.taskUid}) to complete...`);

		let status = settingsTask.status;
		while( status === 'enqueued' || status === 'processing') {
			await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before checking again
			const updatedTask = await client.tasks.getTask(settingsTask.taskUid);
			status = updatedTask.status;
			console.log(updatedTask);
		}

		console.log('Meilisearch index settings configured successfully.');

	} catch (error) {
		console.error('Error configuring Meilisearch index settings:', error);
		if (error.code === 'task_not_found' || error.message?.includes('timeout')) {
			console.error('The task may still be processing in Meilisearch or it timed out.');
		}
	}

	console.log('Indexing complete!');
}

indexContent().catch(error => {
	console.error('Error during indexing:', error);
	process.exit(1);
});