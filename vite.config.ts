import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8080
	},
	plugins: [vue()],
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		alias: [
			{
				find: '@',
				replacement: resolve(__dirname, './src')
			}
		]
	}
});
