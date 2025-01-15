# rehype-ref-commas

This is a rehype plugin that runs after remarkGfm (required), and separates multiple inline citations/references in the generated HTML markup with a comma (and a space). 

## The Problem

Github Flavored Markdown allows you to create footnotes (thus inline citations/references) like this:

```markdown
My cool statement[^reference-1], which is supported by other cool statements[^reference-2][^reference-3].

[^reference-1]: Doe, Jane. 2025. Cool Paper Title.
[^reference-2]: Doe, John. 2024. Supporting Paper Title.
[^reference-3]: Doe, Jane. 2023. Other Supporting Paper Title. 
```

The only problem is that when multiple inline references are used, they wind up looking something like this in the HTML:

```html
<p>
  "My cool statement"
  <sup><a>1</a></sup>
  ", which is supported by other cool statements"
  <sup><a>2</a></sup>
  <sup><a>3</a></sup>
  "."
</p>
```

Which results in a pretty confusing user experience.

## My Solution: A Rehype Plugin (rehype-ref-commas)

This turned out to be the most elegant solution of the ones I explored (see below), so I'm sharing it with anyone who might benefit from such a plugin. What this plugin does is inject `<sup>, </sup>` nodes into the HAST tree, between `<sup />` nodes containing child `<a />` that have a `data-footnote-ref` attribute (which was added by `remarkGfm`).

### Other Solutions

<details>

<summary>Manually inserting `sup` wrapped commas into the markdown</summary>

```markdown
My cool statement[^reference-1], which is supported by other cool statements[^reference-2]<sup>, </sup>[^reference-3].

[^reference-1]: Doe, Jane. 2025. Cool Paper Title.
[^reference-2]: Doe, John. 2024. Supporting Paper Title.
[^reference-3]: Doe, Jane. 2023. Other Supporting Paper Title. 
```

While I like this solution, it's extremely tedious. It's also quite a bit of labor if you've already written an entire article (or several) and need to go back and manually inject such elements.

</details>

<details>

<summary>CSS Styling</summary>

You could use CSS to target the before psuedo-elements where there's multiple references in a row, but in most cases you'd have to wrap every text node in a `<span />` since CSS doesn't pick up raw text nodes as elements. Likewise, this solution doesn't work in a RSS feed reader (which will never use your sites' stylesheets).

</details>

## Usage

Simply import and load `rehypeRefCommas` into your rehype plugins array. Below is an example using [kentcdodds/mdx-bundler](https://github.com/kentcdodds/mdx-bundler) but it should work fine doing things the vanilla way too.

```typescript
import type { Options } from '@mdx-js/loader';
import { bundleMDX } from 'mdx-bundler';
import remarkGfm from 'remark-gfm'; // required for rehypeRefCommas
import rehypeRefCommas from 'rehype-ref-commas';

const result = await bundleMDX({
  source: `# my MDX string ...`,
  mdxOptions(options: Options) {
    options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
    options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeRefCommas];
    return options;
  },
});
```

