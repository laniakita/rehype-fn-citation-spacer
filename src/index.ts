import type { ElementContent, Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import * as v from 'valibot';
import { supCommaSpacer } from './spacers';

export const RehypeCitationSpacerConfigSchema = v.object({
  suppressErr: v.optional(v.boolean()),
  fnDataAttr: v.optional(v.pipe(v.string(), v.minLength(1))),
  spacer: v.optional(
    v.custom<ElementContent>((input) => {
      const testInput =
        (input as ElementContent satisfies ElementContent) || {};
      if (Object.keys(testInput).length === 0 && {}.constructor === Object) {
        return false;
      }
      return true;
    }),
  ),
});

export type RehypeCitationSpacerConfig = v.InferInput<
  typeof RehypeCitationSpacerConfigSchema
>;

/**
 * Inserts a defined "spacer", or a <sup>{`, `}</sup> (default),
 * between adjacent <sup /> wrapping a single child element
 * with a matching data-attr.
 */
const rehypeCitationSpacer: Plugin<[RehypeCitationSpacerConfig?], Root> = ({
  suppressErr = true,
  fnDataAttr = 'dataFootnoteRef',
  spacer = supCommaSpacer,
} = {}) => {
  if (!suppressErr && (fnDataAttr === undefined || fnDataAttr.length === 0)) {
    console.error(
      '[ERR]: Configured fnDataAttr is undefined! Falling back to default: dataFootnoteRef',
    );
    fnDataAttr = 'dataFootnoteRef';
  }

  const testSpacer = (spacer satisfies ElementContent) || {};

  if (
    !suppressErr &&
    Object.keys(testSpacer).length === 0 &&
    {}.constructor === Object
  ) {
    console.error(
      '[ERR]: Configured spacer is not of type ElementContent! Falling back to default: comma-spacer',
    );
    spacer = supCommaSpacer;
  }

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
              childNode?.children?.length === 1 &&
              prevChildNode?.type === 'element' &&
              prevChildNode?.tagName === 'sup' &&
              prevChildNode?.children?.length === 1
            ) {
              const innerChildNode = childNode.children[0];
              const innerPrevChildNode = prevChildNode.children[0];
              if (
                innerChildNode?.type === 'element' &&
                innerPrevChildNode?.type === 'element' &&
                fnDataAttr in innerChildNode.properties &&
                fnDataAttr in innerPrevChildNode.properties
              ) {
                modChildren.unshift(spacer);
              }
            }
          }

          node.children = modChildren;
        }
      }
    });
  };
};

export default rehypeCitationSpacer;
