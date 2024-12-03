import { error, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { hrefs } from '$lib';

export function load({ url }) {
	return { signup: url.searchParams.get('page') === 'signup' };
}
export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const displayName = formData.get('display') as string;
		const username = formData.get('username') as string;
		const { data, error: e } = await supabase.auth.signUp({ email, password });
		if (e) {
			console.error(e);
			error(500, "Auth Error");
		}
		await supabase.from('profiles').insert([{ id: data.user?.id, display: displayName, username }]);
		redirect(303, hrefs.signupSucess);
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const { error: e } = await supabase.auth.signInWithPassword({ email, password });
		if (e) {
			console.error(e);
			error(500, "Auth Error");
		} else {
			redirect(303, hrefs.home);
		}
	}
};
