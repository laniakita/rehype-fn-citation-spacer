# rehype-citation-spacer

This is a rehype plugin that runs after remarkGfm (required), and separates multiple inline citations/references in the generated HTML markup with a comma (and a space).

## The Problem

Github Flavored Markdown allows you to create footnotes (thus inline citations/references) like this:

```markdown
My cool statement[^reference-1], which is supported by other cool statements[^reference-2][^reference-3].

[^reference-1]: Doe, Jane. 2025. Cool Paper Title.
[^reference-2]: Doe, John. 2024. Supporting Paper Title.
[^reference-3]: Doe, Jane. 2023. Other Supporting Paper Title. 
```

The only problem is that when multiple inline references are used in serial, such as in the above, they wind up squished together, making for a pretty confusing user experience. The above example would look like [2](#)[3](#) instead of [2](#) [3](#). That's because in the HTML, the footnote citations are literally stuck together.

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

This seems to explain the phenomena of this in-browser screenshot taken from an integration test:

![screenshot showing end-result of serial footnotes with just remarkGfm, i.e. reference numbers stuck together without any spacing.](./assets/without-rehype-citation-spacer.png "Vanilla remarkGfm Serial Footnote Citation Handling")

## My Solution: A Plugin Named _rehype-citation-spacer_

The core of the problem was a lack of space between in-text footnote references. So, to solve that, I wrote a rehype plugin which injects a _spacer_ (default: `<sup>, </sup>`) between serial `<sup />` nodes into the [hast](https://github.com/syntax-tree/hast) tree. Specifically, the spacer is injected between sequential `<sup />` nodes containing a child `<a />` with an arbritrary target data-attribute (default: `data-footnote-ref`).

The resultant post-injection HTML (of the initial example) would look something like this:

```html
<p>
  "My cool statement"
  <sup><a>1</a></sup>
  ", which is supported by other cool statements"
  <sup><a>2</a></sup>
  <sup>, </sup>
  <sup><a>3</a></sup>
  "."
</p>
```

You can also see how this makes the footnote citations in the integration test much easier to read/interact with:

![screenshot showing the end result of using rehype-citation-spacer, i.e. serial in-text footnote references have a comma and a space between them.](./assets/with-rehype-citation-spacer.png "Demonstrating the _spacers_ injected by rehype-citation-spacer")

### Other Solutions I Explored

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

### Pre-requisites

1. Import and configure `remark-gfm` in your remark plugins array.

    ```typescript
    import {compile} from '@mdx-js/mdx';
    import remarkGfm from 'remark-gfm';

    const processed = await compile("# Some Markdown File", {
      remarkPlugins: [remarkGfm],
    });
    ```

### Default (Empty Configuration)

For the default behavior (spacer: `<sup>, </sup>`, fnDataAttr: "dataFootnoteRef"), simply import and load `rehypeCitationSpacer` into your rehype plugins array. No configuration needed.

```typescript
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeCitationSpacer from 'rehype-citation-spacer'

const processed = await compile("# Some Markdown File", {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeCitationSpacer]
});
```

### Custom Spacer

If you want a different spacer, this plugin let's you do it! Just define a custom spacer, and load it into the `rehypeCitationSpacer` configuration object.

**Important: Your spacer needs to satisfy `ElementContent` otherwise it won't work**! You should also disable `suppressErr` to get feedback from the plugin.

```typescript
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeCitationSpacer from 'rehype-citation-spacer'

// results in `<sup> | </sup>`
const customSpacer = {
  type: 'element',
  tagName: 'sup',
  properties: {},
  children: [
    {
      type: 'text',
      value: ' | ',
    },
  ],
};

const processed = await compile("# Some Markdown File", {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeCitationSpacer, {spacer: customSpacer, suppressErr: false}]]
});
```


### Configuration Reference

| Property | Expected Type             | Default Value               | Description |
|----------|---------------------------|-----------------------------|-------------|
| spacer   | optional `ElementContent` | <pre style="white-space: pre">{<br />  type: 'element',<br/>  tagName: 'sup',<br />  properties: {},<br />  children: [<br/>    {<br />      type: 'text',<br />      value: ', ',<br />    },<br />  ],<br />}; </pre> | You can define a custom spacer, so long as it satisfies the ElementContent type from `@types/hast`. If it doesn't, the default `<sup>, </sup>` spacer will be substituted as a fallback. |
| fnDataAttr | optional (`string` && `string.length() > 0`) | `"dataFootnoteRef"` | This is a value defined in **camelCase**. The default is `dataFootnoteRef` which is found on the superscript wrapped anchor elements created by `remarkGfm` (`<a data-footnote-ref="true" ... />`). Unless you've deviated from the default data-attribute `remarkGfm` applies to footnote citation hyperlinks, you don't need to configure this. |
| suppressErr | optional `boolean` | `true` | This controls the suppression of error messages printed to the console. By default it's set to `true` (i.e., fail silently). If you're deviating from the default configuration, you'll probably want to set this to `false` (i.e., fail loudly). |
