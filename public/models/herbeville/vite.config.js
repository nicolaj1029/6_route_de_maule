import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isPagesBuild = mode === 'pages'

  return {
    plugins: [react()],
    base: isPagesBuild ? '/6_route_de_maule/' : './',
    build: {
      outDir: isPagesBuild ? 'dist' : '../../../webroot/herbeville-app',
      emptyOutDir: true,
      manifest: !isPagesBuild,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  }
})
