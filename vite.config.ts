// Import the SvelteKit plugin to integrate SvelteKit with Vite
import { sveltekit } from '@sveltejs/kit/vite';
// Import Vite's configuration helper function
import { defineConfig } from 'vite';
// Export the Vite configuration
export default defineConfig({
	// Register the SvelteKit plugin so Vite knows how to handle Svelte files and routing
	plugins: [sveltekit()],
	// Configure the development server settings
	server: {
		// Set the port where the development server will run (http://localhost:5173)
		port: 5173,
		// Allow requests coming from any subdomain of ngrok-free.app
		// This lets you access your local dev server through dynamic ngrok URLs,
		// which change each time you restart ngrok, without disabling security completely
		allowedHosts: ['.ngrok-free.app']
	}
});
