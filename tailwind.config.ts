import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			
		}
	},  daisyui: {
		themes: [
		  {
			mytheme: {
			  
	"primary": "#2563eb",
			  
	"secondary": "#6b7280",
			  
	"accent": "#34d399",
			  
	"neutral": "#090909",
			  
	"base-100": "#f3f4f6",
			  
	"info": "#5ab6ff",
			  
	"success": "#00a67e",
			  
	"warning": "#ffa800",
			  
	"error": "#ff0039",
			  },
			},
		  ],
		},

	plugins: [daisyui]
} satisfies Config;
