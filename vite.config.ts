import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8080
	},
	plugins: [vue(), dts()],
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		alias: [
			{
				find: '@',
				replacement: resolve(__dirname, './src')
			}
		]
	},
	build: {
		lib: {
			entry: resolve(__dirname, './src/index.ts'),
			name: 'ChocoMiniappDebugbar',
			fileName: 'choco-miniapp-debugbar'
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
});
