import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { loadEnv } from 'vite';
import { threads, postTypes } from './lib/enums.ts';

const { CONTENT_DIR } = loadEnv(process.env.CONTENT_DIR || 'src/content', process.cwd(), "");

export const baseSchema = z.object({
	title: z.string().min(1, { message: 'Title is required.' }),
	slug: z.string(),
	publish_date: z.coerce.date().default(new Date()),
	modified_date: z.coerce.date().default(new Date()),
});

export const postSchema = baseSchema.extend({
	draft: z.boolean().default(true),
	type: z.enum(postTypes).default('essay'),
	thread: z.enum(threads).optional(),
	peer_reviewed: z.boolean().default(false).optional(),
	authors: z.array(reference("authors")),
	citation_override: z.string().optional(),
	doi: z.string().url().optional(),
	blurb: z.string().optional(),
	riposte_to: z.string().optional(),
	image: z.string().optional(),
});

export const gatheringSchema = baseSchema.extend({
	draft: z.boolean().default(true),
	doi: z.string().url().optional(),
	authors: z.array(reference("authors")),
	posts: z.array(reference("posts")).optional(),
	image: z.string().optional(),
});

export const authorSchema = baseSchema.extend({
	qid: z.string().regex(/^Q\d+$/).optional()
});

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: CONTENT_DIR+"/essays" }),
	schema: gatheringSchema
});

const gatherings = defineCollection({
	loader: glob({ pattern: "**/*.md", base: CONTENT_DIR+"/gatherings" }),
	schema: gatheringSchema
});

const authors = defineCollection({
	loader: glob({ pattern: "**/*.md", base: CONTENT_DIR+"/authors" }),
	schema: authorSchema
});

export const collections = { posts, gatherings, authors };