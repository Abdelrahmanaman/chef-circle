// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
var app_config_default = defineConfig({
  vite: {
    resolve: {
      alias: {
        // Manually define the alias as a fallback
        "@": path.resolve(__dirname, "./app")
      }
    },
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"]
      }),
      tailwindcss()
    ]
  }
});
export {
  app_config_default as default
};
