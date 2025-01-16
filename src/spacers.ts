import type { ElementContent } from 'hast';

export const supCommaSpacer = {
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
