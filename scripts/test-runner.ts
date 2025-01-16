import type { BunPlugin } from "bun";
import { mdxPlugin } from "lib/bun-mdx";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const buildTestDist = async () => {
  const cwd = process.cwd();
  const testsDir = './__tests__';
  try {
    // create build output folder
    const appBuildPath = path.join(cwd, `${testsDir}/dist/app-build`);
    await mkdir(appBuildPath, {recursive: true});
    
    // copy the index.html to the folder
    const indexHtml = Bun.file(path.join(cwd, `${testsDir}/fixtures/app/index.html`));
    await Bun.write(path.join(cwd, `${testsDir}/dist/app-build/index.html`), indexHtml);
    
    // ROTFA
    await Bun.build({
      entrypoints: [path.join(cwd, `${testsDir}/fixtures/app/index.tsx`)],
      outdir: path.join(cwd, `${testsDir}/dist`),
      plugins: [(mdxPlugin as unknown as BunPlugin)],
      throw: true,
    });
  } catch (e) {
    const error = e as AggregateError;
    console.error('OH NOES! Build failed!');
    console.error(error);
  }
};

await buildTestDist();
