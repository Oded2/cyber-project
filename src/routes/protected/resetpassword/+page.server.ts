import { hrefs } from '$lib';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	reset: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		if (password !== confirmPassword)
			throw error(422, { message: 'Password must match password confirmation' });
		const { error: e } = await supabase.auth.updateUser({ password });
		if (e) throw error(e.status ?? 400, { message: e.message });
		redirect(303, hrefs.home);
	}
};
