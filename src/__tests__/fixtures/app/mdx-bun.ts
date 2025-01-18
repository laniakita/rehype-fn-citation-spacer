import rehypeCitationSpacer from '@/src/index';
import mdx from '@mdx-js/esbuild';
import remarkGfm from 'remark-gfm';

export const mdxPlugin = mdx({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeCitationSpacer]],
});
