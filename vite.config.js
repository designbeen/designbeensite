const { defineConfig, loadEnv } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || `http://localhost:${env.PORT || 5000}`,
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_API_PROXY_TARGET || `http://localhost:${env.PORT || 5000}`,
          changeOrigin: true,
        },
      },
    },
  };
});
