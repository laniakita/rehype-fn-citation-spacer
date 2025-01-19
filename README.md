<div align="center">
    <h1>r e h y p e - c i t a t i o n - s p a c e r</h1>
    <p>A Rehype plugin that makes some space between adjacent in-text footnote citations/references.</p>
</div>

## Summary

This is a simple rehype plugin that's designed to run after [`remark-gfm`](https://github.com/remarkjs/remark-gfm), and separates any generated in-text footnote citations/references found in the [hast tree](https://github.com/syntax-tree/hast) with either a _comma and a space_ ([default](#default-empty-configuration)) or a [user defined spacer](#custom-spacer).

## Table of Contents

- [Summary](#summary)
- [Table of Contents](#table-of-contents)
- [The Problem](#the-problem)
- [This Solution: Plugin Named _rehype-fn-citation-spacer_](#this-solution-plugin-named-rehype-fn-citation-spacer)
  - [Other Solutions I Explored](#other-solutions-i-explored)
- [Install](#install)
- [Usage](#usage)
  - [Default (Empty Configuration)](#default-empty-configuration)
  - [Custom Spacer](#custom-spacer)
  - [Configuration Reference](#configuration-reference)
- [Contributing](#contributing)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting New Features](#suggesting-new-features)

## The Problem

<div align="center">
<figure>

![screenshot showing end-result of serial footnotes with just remarkGfm, i.e. reference numbers stuck together without any spacing.](./assets/without-rehype-fn-citation-spacer.png "Vanilla remarkGfm Serial Footnote Citation Handling")

<figcaption><strong>Figure 1</strong>: Using pure <a href="https://github.github.com/gfm/">Github Flavored Markdown</a> syntax, serial In-text footnote citations <em>1, 2, 3, & 4</em> get squished in the resultant markup, appearing as <em>1234</em> instead.</figcaption>

</figure>
</div>

<br />

Github Flavored Markdown allows you to create footnotes and in-text footnote citations/references like this:

```markdown
My cool statement[^reference-1], which is supported by other cool statements[^reference-2][^reference-3].

[^reference-1]: Doe, Jane. 2025. Cool Paper Title.
[^reference-2]: Doe, John. 2024. Supporting Paper Title.
[^reference-3]: Doe, Jane. 2023. Other Supporting Paper Title. 
```

The only problem is that when multiple inline references are used in serial they wind up squished together, making for a pretty confusing user experience. The above example would look like [2](#)[3](#) instead of [2](#) [3](#), similar to **Figure 1**. That's because in the HTML, the footnote citations are literally stuck together.

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

## This Solution: Plugin Named _rehype-fn-citation-spacer_

<div align="center">
<figure>

![screenshot showing the end result of using rehype-fn-citation-spacer, i.e. serial in-text footnote references have a comma and a space between them.](./assets/with-rehype-fn-citation-spacer.png "Demonstrating the _spacers_ injected by rehype-fn-citation-spacer")

<figcaption><strong>Figure 2</strong>: Using <code>rehype-fn-citation-spacer</code> with its <a href="#default-empty-configuration">default configuration</a>, serial In-text footnote citations <em>1, 2, 3, & 4</em> appear properly as <em>1, 2, 3, 4</em>.</figcaption>

</figure>
</div>

<br />

The core of the problem was a lack of space between in-text footnote references. So, I wrote this rehype plugin to inject a _spacer_ (default: `<sup>, </sup>`) between adjacent `<sup />` nodes in the [hast](https://github.com/syntax-tree/hast) tree, to make some space.

Specifically, the spacer is injected between sequential `<sup />` nodes containing a single child `<a />` node with an arbitrary target data-attribute (default: `data-footnote-ref`). The end result of this process is demonstrated by **Figure 2**.

Likewise, using **Figure 2** as a basis, we can estimate that the resultant post-injection HTML of the initial example would probably look something like this:

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

You could use CSS to target the before psuedo-elements where there's multiple references in a row, but in most cases you'd have to wrap every text node in a `<span />` since CSS doesn't pick up raw text nodes as elements. Likewise, this solution doesn't work in a RSS feed reader (which will never use your site's stylesheets).

</details>

## Install

This is a [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) module.

You can install `rehype-fn-citation-spacer` with any node package manager. Using `bun` as an example, the command looks like:

```console
bun add rehype-fn-citation-spacer
```

<details>

<summary><strong>why <code>remark-gfm</code> isn't a dependency.</strong></summary>

`rehype-fn-citation-spacer` won't error out if it's not present. In fact, so long as it finds `<sup />` nodes, that wrap a single element node with some target data-attribute (see: [fnDataAttr](#configuration-reference)), it will inject a spacer just fine.

</details>

## Usage

### Default (Empty Configuration)

For the default behavior (spacer: `<sup>, </sup>`, fnDataAttr: "dataFootnoteRef"), simply import and load `rehypeFnCitationSpacer` into your rehype plugins array. No configuration needed.

```typescript
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeFnCitationSpacer from 'rehype-fn-citation-spacer'

const processed = await compile("# Some Markdown File", {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeFnCitationSpacer]
});
```

### Custom Spacer

If you want a different spacer, this plugin let's you do it! Just define a custom spacer, and load it into the `rehypeFnCitationSpacer` configuration object.

**Important: Your spacer needs to be of type `ElementContent`, otherwise it will fail to inject!** You should also enable `verboseErr` to get detailed error messages from the plugin.

```typescript
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeFnCitationSpacer, {type rehypeFnCitationSpacerConfig} from 'rehype-fn-citation-spacer'

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
  verboseErr: false
} satisfies rehypeFnCitationSpacerConfig; // only needed if you want type checking

const processed = await compile("# Some Markdown File", {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeFnCitationSpacer, myCustomRCSConfig]]
});
```

### Configuration Reference

| Property | Expected Type             | Default Value               | Description |
|----------|---------------------------|-----------------------------|-------------|
| spacer   | optional `ElementContent` | <pre style="white-space: pre">{<br />  type: 'element',<br/>  tagName: 'sup',<br />  properties: {},<br />  children: [<br/>    {<br />      type: 'text',<br />      value: ', ',<br />    },<br />  ],<br />}; </pre> | If you'd like to use your own spacer, you can define a custom spacer here. It must be of type `ElementContent` from `@types/hast`, otherwise the plugin won't inject it. |
| fnDataAttr | optional (`string` && `string.length() > 0`) | `"dataFootnoteRef"` | This is a value defined in **camelCase**. The default is `dataFootnoteRef` which is found on the superscript wrapped anchor elements created by `remarkGfm` (`<a data-footnote-ref="true" ... />`). Unless you've deviated from the default data-attribute `remarkGfm` applies to footnote citation hyperlinks, **you don't need to configure this.** |
| verboseErr | optional `boolean` | `false` | This controls the verbosity of the error message printed to the console. By default, it's set to `false`. If you're deviating from the default configuration, you'll probably want to set this to `true`. |

## Contributing

Contributions are welcome! So, Feel free to submit a PR! Just make sure to include a brief summary of what you've changed/added, and why.

### Reporting Bugs

If something's not working right, please don't hesitate to [open an issue](https://github.com/laniakita/rehype-fn-citation-spacer/issues/new) with the _bug_ label (or other relevant label(s)). Likewise, please make sure to include the following in your bug report:

- Describe what happened.
- Describe the environment where this occurred (OS, Node.js version, etc.).
- The console output generated by using `verboseErr: true` in your configuration.

### Suggesting New Features

If you've got an idea, I'd love to hear about it. Just [create a new issue](https://github.com/laniakita/rehype-fn-citation-spacer/issues/new) with the _enhancement_ label (or other relevant label(s)).
