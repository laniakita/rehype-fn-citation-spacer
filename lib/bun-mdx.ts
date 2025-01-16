import mdx from "@mdx-js/esbuild";
import remarkGfm from "remark-gfm";
import rehypeRefCommas from "@/src/rehype-ref-commas";

export const mdxPlugin = mdx({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeRefCommas],
});
