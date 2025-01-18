import dts from 'bun-plugin-dts';

try {
  await Promise.all([
    Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist',
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
