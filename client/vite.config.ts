import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path';
// import fs from "fs"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
    // https: {
    //   key: fs.readFileSync('./.cert/localhost-key.pem'),
    //   cert: fs.readFileSync('./.cert/localhost.pem'),
    // },
  },
  build: {

  }
})
