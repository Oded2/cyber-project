import { error, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { addParams, hrefs } from '$lib';

export function load({ url }) {
	const params = url.searchParams;
	const errorMessage = (params.get("error") ?? "") as string;
	return { signup: params.get('page') === 'signup', errorMessage };
}
export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const displayName = formData.get('display') as string;
		const username = formData.get('username') as string;
		validate(email, "Email", 0)
		validate(password, "Password", 8, 128)
		validate(displayName, "Display Name", 0, 50)
		validate(username, "Username", 0, 50)
		const { data, error: e } = await supabase.auth.signUp({ email, password });
		if (e) {
			console.error(e);
			error(e.status!, { message: e.message });
		}
		await supabase.from('profiles').insert([{ id: data.user?.id, display: displayName, username }]);
		redirect(303, hrefs.signupSucess);
	},
	login: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const { error: e } = await supabase.auth.signInWithPassword({ email, password });
		if (e) {
			console.error(e);
			const message = e.message;
			if (message === "Invalid login credentials") redirect(303, addParams(hrefs.login, { error: "Email or password is incorrect" }, url.origin));
			error(e.status!, { message: message });
		} else {
			redirect(303, hrefs.home);
		}
	}
};

function validate(input: string, inputName: string, min: number = 0, max: number = 500): void {
	if (input.length < min) error(400, { message: `${inputName} must be at least ${min} characters long.` })
	if (input.length > max) error(400, { message: `${inputName} cannot exceed ${max} characters.` })
}