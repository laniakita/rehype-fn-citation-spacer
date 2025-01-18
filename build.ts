import dts from 'bun-plugin-dts';

try {
  await Promise.all([
    Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist_with_valibot',
      format: 'esm',
      naming: '[dir]/[name].js',
      plugins: [dts()],
      throw: true,
    }),
  ]);
  await Promise.all([
    Bun.build({
      entrypoints: ['./src/zod-index.ts'],
      outdir: './dist_with_zod',
      format: 'esm',
      naming: '[dir]/[name].js',
      plugins: [dts()],
      throw: true,
    }),
  ]);
} catch (err) {
  const error = err as AggregateError;
  console.error('OH NOES! Build failed!');
  console.error(error);
}
