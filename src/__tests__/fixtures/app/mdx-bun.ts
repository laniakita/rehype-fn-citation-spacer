import mdx from '@mdx-js/esbuild';
import remarkGfm from 'remark-gfm';
import rehypeCitationSpacer, {
  type RehypeCitationSpacerConfig,
} from '../../../../dist';

const myCustomRCSConfig = {
  spacer: {
    type: 'element',
    tagName: 'sup',
    properties: {},
    children: [
      {
        type: 'text',
        value: ' | ',
      },
    ],
  },
  suppressErr: false,
} satisfies RehypeCitationSpacerConfig;

export const mdxPlugin = mdx({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeCitationSpacer, myCustomRCSConfig]],
});
