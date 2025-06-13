import { visit } from 'unist-util-visit';

export function remarkEmbed() {
	return (tree) => {
		visit(tree, 'inlineCode', (node) => {
			if (node.value.startsWith('youtube')) {
				const videoID = node.value.slice(8);
				if (videoID) {
					node.type = 'html';
					node.value = `<div class="w-full"><div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${videoID}" loading="lazy"></iframe></div></div>`;
				}
			} else if (node.value.startsWith('vimeo')) {
				const videoID = node.value.slice(6);
				if (videoID) {
					node.type = 'html';
					node.value = `<div class="w-full"><div style="position: relative; padding-bottom: 56.25%; padding-top: 25px; height: 0;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://player.vimeo.com/video/${videoID}?color=ffffff&title=0&byline=0&portrait=0&badge=0" allowfullscreen loading="lazy"></iframe></div></div>`;
				}
			} else if (node.value.startsWith('spotify')) {
				const videoID = node.value.slice(8);
				if (videoID) {
					node.type = 'html';
					node.value = `<div class="w-full"><div style="position: relative; padding-bottom: 152px; height: 0;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 152px;" src="https://open.spotify.com/embed/episode/${videoID}?t=0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div></div>`;
				}
			}
		});
	};
}
