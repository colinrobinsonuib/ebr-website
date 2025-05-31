import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Plugin, Transformer } from 'unified'
import type { Root, Element, RootContent } from 'hast'

/**
 * A rehype plugin to strip a single wrapping `<p>` from the root.
 */
export const stripParagraph: Plugin<[], Root, Root> = () => {
	const transformer: Transformer<Root, Root> = (tree) => {
		if (
			tree.children.length === 1 &&
			tree.children[0].type === 'element' &&
			(tree.children[0] as Element).tagName === 'p'
		) {
			const p = tree.children[0] as Element
			tree.children = p.children as unknown as RootContent[]
		}
	}

	return transformer
}

export async function renderTitle(title:string) {
	const htmlTitle = await unified().use(remarkParse).use(remarkRehype).use(stripParagraph).use(rehypeStringify).process(title);
	return String(htmlTitle);
}