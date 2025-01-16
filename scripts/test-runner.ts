import type { BunPlugin } from "bun";
import { mdxPlugin } from "lib/bun-mdx";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const buildTestDist = async () => {
  const __dirname = import.meta.dir;
  const appBuildDir = '../__tests__/dist/app-build';
  const appSrcDir = '../__tests__/fixtures/app';

  try {
    // create build output folder
    const appBuildPath = path.join(__dirname, appBuildDir);
    await mkdir(appBuildPath, {recursive: true});
    
    // copy the index.html to the folder
    const indexHtml = Bun.file(path.join(__dirname, `${appSrcDir}/index.html`));
    await Bun.write(`${appBuildPath}/index.html`, indexHtml);

    // ROTFA
    await Bun.build({
      entrypoints: [path.join(__dirname, `${appSrcDir}/index.tsx`)],
      outdir: path.join(__dirname, appBuildDir),
      plugins: [(mdxPlugin as unknown as BunPlugin)],
      throw: true,
      experimentalCss: true,
    });
  } catch (e) {
    const error = e as AggregateError;
    console.error('OH NOES! Build failed!');
    console.error(error);
  }
};

await buildTestDist();
