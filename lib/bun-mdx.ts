import rehypeCitationSpacer from '@/src/rehype-citation-spacer';
import mdx from '@mdx-js/esbuild';
import remarkGfm from 'remark-gfm';

export const mdxPlugin = mdx({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeCitationSpacer, { SuppressErr: false }]],
});
