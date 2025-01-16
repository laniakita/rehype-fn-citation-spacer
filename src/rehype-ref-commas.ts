import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Inserts a <sup>{`, `}</sup> inbetween adjacent <sup /> elements.
 * todo: attribute filter
 *
 */
export const rehypeRefCommas = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'p') {
        if (node.children.length > 1) {
          const modChildren: ElementContent[] = [];

          for (let i = node.children.length - 1; i >= 0; i--) {
            const childNode = node.children[i];
            const prevChildNode = node.children[i - 1];
            modChildren.unshift(childNode as ElementContent);

            if (
              childNode?.type === 'element' &&
              childNode?.tagName === 'sup' &&
              prevChildNode?.type === 'element' &&
              prevChildNode?.tagName === 'sup'
            ) {
              const supCommaSpacer = {
                type: 'element',
                tagName: 'sup',
                properties: {},
                children: [
                  {
                    type: 'text',
                    value: ', ',
                  },
                ],
              } satisfies ElementContent;
              modChildren.unshift(supCommaSpacer);
            }
          }

          node.children = modChildren;
        }
      }
    });
  };
};
