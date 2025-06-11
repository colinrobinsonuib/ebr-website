import { getCollection } from 'astro:content';
import type { PublishedPost } from '../content.config.ts';

export async function getPublishedPosts(): Promise<PublishedPost[]> {
	const publishedPosts = (await getCollection('posts', ({ data }) => {
		return !data.draft && data.publish_date instanceof Date;
	})) as PublishedPost[];
	publishedPosts.sort((a, b) => {
		return b.data.publish_date.getTime() - a.data.publish_date.getTime();
	});
	return publishedPosts;
}
