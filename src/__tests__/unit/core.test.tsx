import type { ElementContent } from 'hast';
import { describe, expect, spyOn, test, } from 'bun:test';
import { compile, evaluate } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import * as ReactDomServer from 'react-dom/server';
import { rehypeCitationSpacer } from '../../core';
import path from 'node:path';
import { supCommaSpacer } from '@/src/spacers';

const commasNeededFile = Bun.file(
  path.join(import.meta.dir, '../fixtures/posts/commas-needed.mdx'),
);
const noCommasNeededFile = Bun.file(
  path.join(import.meta.dir, '../fixtures/posts/no-commas-needed.mdx'),
);
const commasNeededString = await commasNeededFile.text();
const noCommasNeededString = await noCommasNeededFile.text();

const debugSpacer = {
  ...supCommaSpacer,
  properties: {
    dataCoreTest: true
  }
} satisfies ElementContent;

describe('Core Error Handling', () => {
  test('Fallback to default spacer', async () => {
    const consoleSpy = spyOn(console, "error");



    const { default: CompileBad } = await evaluate(commasNeededString, {
      ...runtime,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeCitationSpacer, {
        suppressErr: false,
        spacer: {} 
      }]]
    });
    

  })
})

const { default: CompileOne } = await evaluate(commasNeededString, {
  ...runtime,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypeCitationSpacer, {
    spacer: debugSpacer
  }]]
});

//console.log(ReactDomServer.renderToStaticMarkup(<CompileOne />));
