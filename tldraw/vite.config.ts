// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from "@rollup/plugin-typescript"

export default defineConfig({
    plugins: [react(), typescript()],
    define: {
        // This will replace `process.env` with `{}` during the build
        'process.env': {}
    },
    build: {
        lib: {
            // This is the entry point that Vite will use to build the library
            entry: './src/index.ts',
            name: 'TldrawWebComponent',
            fileName: 'tldraw-web-component',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            // Make sure these are treated as externals or included as needed.
            // For a truly standalone build, you might not want them external.
            // But if you'd prefer to avoid bundling large libraries, you can externalize them:
            // external: ['react', 'react-dom'],
            // output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } }
        }
    }
})
