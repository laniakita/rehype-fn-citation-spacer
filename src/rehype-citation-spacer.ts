import type { ElementContent, Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export interface RehypeRefConfigOpts {
  childDataAttrBoolName?: string;
  spacer?: ElementContent;
  verbose?: boolean;
  suppressErr?: boolean;
}

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

/**
 * Inserts a <sup>{`, `}</sup> inbetween adjacent <sup /> elements.
 */
const rehypeCitationSpacer: Plugin<[RehypeRefConfigOpts?], Root> = ({
  childDataAttrBoolName = 'dataFootnoteRef',
  spacer = supCommaSpacer,
  verbose = false,
  suppressErr = true,
} = {}) => {
  // verbose vars
  const t0 = performance.now();
  let modifiedFlag = false;
  let nodeNumCount = 0;
  let treeLen = 0;

  if (verbose) {
    console.log('[INFO]: Beginning Preflight checks!');
    console.log('[INFO]: Testing spacer configuration ...');
  }

  if (!suppressErr && childDataAttrBoolName === undefined) {
    console.error(
      '[ERR]: Configured childDataAttrBoolName is undefined! Falling back to default: dataFootnoteRef',
    );
  } else if (verbose) {
    console.log(
      `[INFO]: childDataAttrBoolName is set to ${childDataAttrBoolName}`,
    );
  }

  // Handle spacer config error with grace.
  if (!suppressErr && !(spacer satisfies ElementContent)) {
    console.error(
      '[ERR]: Configured spacer is not of type ElementContent! Falling back to default: comma-spacer',
    );
    spacer = supCommaSpacer;
  } else if (verbose) {
    console.log('[SUCCESS]: Configured spacer satisfies ElementContent :3');
  }

  if (verbose) {
    console.log('[INFO]: Preflight systems OK!');
    console.log('[INFO]: Starting dark matter engines.');
  }

  return (tree: Root) => {
    if (verbose && tree) {
      console.log(
        `[INFO]: HAST Tree with ${tree.children.length} child nodes found!`,
      );
      console.log('[INFO]: All Systems OK!');
      console.log('[INFO]: Lift off!');
    } else if (!suppressErr && !tree) {
      console.error(
        '[CRIT]: HAST Tree is missing! Visiting nodes is impossible! D:',
      );
    }
    treeLen = tree.children.length;
    visit(tree, 'element', (node) => {
      if (verbose)
        console.log(
          `[INFO]: Now Visiting Element Node: #${nodeNumCount} (${node.tagName} el)`,
        );
      if (node.tagName === 'p') {
        if (node.children.length > 1) {
          const modChildren: ElementContent[] = [];

          for (let i = node.children.length - 1; i >= 0; i--) {
            const childNode = node.children[i];
            const prevChildNode = node.children[i - 1];
            modChildren.unshift(childNode as ElementContent);

            if (verbose) {
              console.log('[INFO]: Added first child node of paragraph node');
            }

            if (
              childNode?.type === 'element' &&
              childNode?.tagName === 'sup' &&
              childNode?.children?.length === 1 &&
              prevChildNode?.type === 'element' &&
              prevChildNode?.tagName === 'sup' &&
              prevChildNode?.children?.length === 1
            ) {
              if (verbose) {
                console.log(
                  '[INFO]: Found adjacent sup elements (childNode & prevChildNode).',
                );
                console.log(childNode);
                console.log(prevChildNode);
                console.log(
                  `[INFO]: Testing data-attr filter ${childDataAttrBoolName}`,
                );
              }

              const innerChildNode = childNode.children[0];
              const innerPrevChildNode = prevChildNode.children[0];

              // check for data-attribute on child of both childNodes
              if (
                innerChildNode?.type === 'element' &&
                innerPrevChildNode?.type === 'element'
              ) {
                if (
                  childDataAttrBoolName in innerChildNode.properties &&
                  childDataAttrBoolName in innerPrevChildNode.properties
                ) {
                  if (verbose) {
                    console.log(
                      '[SUCCESS]: Found anchor elements with filter in both adjacent sup elements!',
                    );
                    console.log(innerChildNode);
                    console.log(innerPrevChildNode);
                  }

                  modChildren.unshift(spacer);
                  modifiedFlag = true;
                  if (verbose) {
                    console.log('[SUCCESS]: Injected spacer into HAST tree!');
                    console.log(spacer);
                  }
                }
              }
            }
          }
          if (modifiedFlag) {
            node.children = modChildren;
            if (verbose)
              console.log(
                `[SUCCESS]: Modified HAST tree in ${performance.now() - t0} ms`,
              );
          } else if (verbose) {
            console.log(
              `[SUCCESS]: Nothing modified! Returned unmodified HAST tree in ${performance.now() - t0} ms`,
            );
          }
          modifiedFlag = false;
        }
      }
      nodeNumCount++;
    });
  };
};

export default rehypeCitationSpacer;
