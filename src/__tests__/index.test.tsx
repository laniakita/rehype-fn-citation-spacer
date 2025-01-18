import { afterEach, describe, expect, jest, spyOn, test } from 'bun:test';
import path from 'node:path';
import { supCommaSpacer } from '@/src/spacers';
import { evaluate } from '@mdx-js/mdx';
import type { ElementContent } from 'hast';
import * as ReactDomServer from 'react-dom/server';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeCitationSpacer, {
  type RehypeCitationSpacerConfig,
} from '../index';

const commasNeededFile = Bun.file(
  path.join(import.meta.dir, './fixtures/posts/commas-needed.mdx'),
);
const noCommasNeededFile = Bun.file(
  path.join(import.meta.dir, './fixtures/posts/no-commas-needed.mdx'),
);
const commasNeededString = await commasNeededFile.text();
const noCommasNeededString = await noCommasNeededFile.text();

const customSpacer = {
  ...supCommaSpacer,
  children: [
    {
      type: 'text',
      value: ' | ',
    },
  ],
} satisfies ElementContent;

const resCommas = async (
  isCommas: boolean,
  options?: RehypeCitationSpacerConfig,
) => {
  return await evaluate(isCommas ? commasNeededString : noCommasNeededString, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeCitationSpacer, options]],
  });
};

const resCommasNoRemark = async (
  isCommas: boolean,
  options?: RehypeCitationSpacerConfig,
) => {
  return await evaluate(isCommas ? commasNeededString : noCommasNeededString, {
    ...runtime,
    rehypePlugins: [[rehypeCitationSpacer, options]],
  });
};

const sharedConf = {
  verboseErr: true,
};

const badSpacerConf = {
  ...sharedConf,
  spacer: {} as ElementContent,
};
const badAttrConf = {
  ...sharedConf,
  fnDataAttr: '',
};

const badAttrConf3 = {
  ...sharedConf,
  fnDataAttr: {} as string,
};

const customSpacerConf = {
  ...sharedConf,
  spacer: customSpacer,
};

const consoleSpy = spyOn(console, 'error').mockImplementation(() => {});

const re = /<sup>, <\/sup>/g;

afterEach(() => {
  jest.clearAllMocks();
});

describe('Err handling', async () => {
  test('badSpacerConf => Output contains "spacer"', async () => {
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    await resCommas(true, badSpacerConf);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const spacerErr = consoleSpy.mock.calls.some((call) =>
      call.some((arg) => typeof arg === 'string' && arg.includes('spacer')),
    );
    expect(spacerErr).toBeTruthy();
  });

  test('badAttrConf => Output contains "invalid length"', async () => {
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    await resCommas(true, badAttrConf);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const fnDataAttrErr = consoleSpy.mock.calls.some((call) =>
      call.some(
        (arg) => typeof arg === 'string' && arg.includes('Invalid length'),
      ),
    );
    expect(fnDataAttrErr).toBeTruthy();
  });

  test('badAttrConf3 => Output contains "Invalid type"', async () => {
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    await resCommas(true, badAttrConf3);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const fnDataAttrErr = consoleSpy.mock.calls.some((call) =>
      call.some(
        (arg) => typeof arg === 'string' && arg.includes('Invalid type'),
      ),
    );
    expect(fnDataAttrErr).toBeTruthy();
  });

  test('Prints nothing on empty (good) config', async () => {
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    await resCommas(true);
    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });

  test('Prints nothing on customSpacer', async () => {
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    await resCommas(true, customSpacerConf);
    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });
});

describe('Plugin does nothing on Err', async () => {
  test('commasNeeded: badSpacerConf => no spacer', async () => {
    const { default: TestCompileBadSpacer } = await resCommas(
      true,
      badSpacerConf,
    );
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileBadSpacer />,
    );
    expect(htmlString).not.toMatch(re);
  });

  test('noCommasNeeded: badSpacerConf => contains no spacer', async () => {
    const { default: TestCompileBadSpacer } = await resCommas(
      false,
      badSpacerConf,
    );
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileBadSpacer />,
    );
    expect(htmlString).not.toMatch(re);
  });

  test('commasNeeded: badAttrConf => contains no spacer', async () => {
    const { default: TestCompileBadAttr } = await resCommas(true, badAttrConf);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileBadAttr />,
    );
    expect(htmlString).not.toMatch(re);
  });

  test('noCommasNeeded: badAttrConf => contains no spacer', async () => {
    const { default: TestCompileBadAttr } = await resCommas(false, badAttrConf);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileBadAttr />,
    );
    expect(htmlString).not.toMatch(re);
  });
});

describe('Empty (default) config is valid', async () => {
  test('commasNeeded: contains default spacer (`<sup>, </sup>`)', async () => {
    const { default: TestCompileDefault } = await resCommas(true);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileDefault />,
    );
    expect(htmlString).toMatch(re);
  });

  test('commasNeeded: contains default spacer in 4 places', async () => {
    const { default: TestCompileDefault } = await resCommas(true);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileDefault />,
    );
    const matches = htmlString.match(re);
    expect(matches).toHaveLength(4);
  });

  test('noCommasNeeded: contains no spacer', async () => {
    const { default: TestCompileDefault } = await resCommas(false);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileDefault />,
    );
    expect(htmlString).not.toMatch(re);
  });

  test('noCommasNeeded: contains default spacer no where', async () => {
    const { default: TestCompileDefault } = await resCommas(false);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileDefault />,
    );
    const matches = htmlString.match(re);
    expect(matches).not.toHaveLength;
  });
});

describe('Custom spacer config is valid', async () => {
  const re = /<sup> \| <\/sup>/g;
  test('commasNeeded: contains custom spacer (`<sup> | </sup>`)', async () => {
    const { default: TestCompileCustomSpacer } = await resCommas(
      true,
      customSpacerConf,
    );
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileCustomSpacer />,
    );
    expect(htmlString).toMatch(re);
  });

  test('commasNeeded: contains custom spacer in 4 places', async () => {
    const { default: TestCompileCustomSpacer } = await resCommas(
      true,
      customSpacerConf,
    );
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileCustomSpacer />,
    );
    const matches = htmlString.match(re);
    expect(matches).toHaveLength(4);
  });

  test('noCommasNeeded: contains no spacer', async () => {
    const { default: TestCompileCustomSpacer } = await resCommas(
      false,
      customSpacerConf,
    );
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileCustomSpacer />,
    );
    expect(htmlString).not.toMatch(re);
  });

  test('noCommasNeeded: contains custom spacer no where', async () => {
    const { default: TestCompileCustomSpacer } = await resCommas(
      false,
      customSpacerConf,
    );
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileCustomSpacer />,
    );
    const matches = htmlString.match(re);
    expect(matches).not.toHaveLength;
  });
});

describe('Does nothing without remarkGfm', async () => {
  const reCustom = /<sup> \| <\/sup>/g;

  test('commasNeeded: contains no spacer', async () => {
    const { default: TestCompileNoRemark } = await resCommasNoRemark(true);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileNoRemark />,
    );
    expect(htmlString).not.toMatch(reCustom);
  });

  test('noCommasNeeded: contains no spacer', async () => {
    const { default: TestCompileNoRemark } = await resCommasNoRemark(false);
    const htmlString = ReactDomServer.renderToStaticMarkup(
      <TestCompileNoRemark />,
    );
    expect(htmlString).not.toMatch(reCustom);
  });
});
