export const postTypes = ['essay', 'article', 'review', 'interview', 'riposte'] as const;

export type PostType = (typeof postTypes)[number];

export const postTypeColors: Record<PostType, string> = {
	essay: '#12ff93',
	article: '#E4B363',
	review: '#24CCFF',
	interview: '#cb5aff',
	riposte: '#EF6461',
};
