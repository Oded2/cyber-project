import { hrefs } from '$lib';
import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(301, hrefs.home);
}
