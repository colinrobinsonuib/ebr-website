import { type CollectionEntry, defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { threads } from './lib/threads.ts';
import { postTypes } from './lib/postTypes.ts';
import { CONTENT_DIR } from 'astro:env/server';

export const baseSchema = z.object({
	title: z.string().min(1, { message: 'Title is required.' }),
	slug: z.string(),
	publish_date: z.coerce.date().optional(),
	modified_date: z.coerce.date(),
});
export type BaseItem = {
	id: string;
	data: z.infer<typeof baseSchema>;
};

export const postSchema = baseSchema.extend({
	draft: z.boolean().default(true),
	type: z.enum(postTypes).default('essay'),
	thread: z.enum(threads).optional(),
	peer_reviewed: z.boolean().default(false).optional(),
	authors: z.array(reference('authors')),
	citation_override: z.string().optional(),
	doi: z.string().url().optional(),
	blurb: z.string().optional(),
	riposte_to: reference('posts').optional(),
	image: z.string().optional(),
});
type Post = CollectionEntry<'posts'>;
export type PublishedPost = Post & { data: Post['data'] & { draft: false; publish_date: Date } };

export const gatheringSchema = baseSchema.extend({
	draft: z.boolean().default(true),
	doi: z.string().url().optional(),
	authors: z.array(reference('authors')),
	posts: z.array(reference('posts')).optional(),
	image: z.string().optional(),
	type: z.string().default('gathering'),
});

export const newsletterSchema = baseSchema.extend({
	draft: z.boolean().default(true),
	authors: z.array(reference('authors')),
	type: z.string().default('newsletter'),
});

export const authorSchema = baseSchema.extend({
	qid: z
		.string()
		.regex(/^Q\d+$/)
		.optional(),
});

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: CONTENT_DIR + '/posts' }),
	schema: postSchema,
});

const gatherings = defineCollection({
	loader: glob({ pattern: '**/*.md', base: CONTENT_DIR + '/gatherings' }),
	schema: gatheringSchema,
});

const newsletters = defineCollection({
	loader: glob({ pattern: '**/*.md', base: CONTENT_DIR + '/newsletters' }),
	schema: newsletterSchema,
});

const authors = defineCollection({
	loader: glob({ pattern: '**/*.md', base: CONTENT_DIR + '/authors' }),
	schema: authorSchema,
});

export type Author = CollectionEntry<'authors'>;

export const collections = { posts, gatherings, newsletters, authors };
