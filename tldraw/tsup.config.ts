import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['index.ts'],
    dts: true,
    clean: true,
});