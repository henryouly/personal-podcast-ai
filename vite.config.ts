import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import devServer from "@hono/vite-dev-server";
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: "api/index.ts",
      exclude: [
        /^\/(?!api\/).*/,
        /^(?!\/api\/).*/,
        /^\/src\/.*/,
        /^\/node_modules\/.*/,
        /^\/@vite\/.*/,
        /^\/@react-refresh$/,
        /^\/index\.html$/,
      ],
    }),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
    fileParallelism: false,
  },
});
