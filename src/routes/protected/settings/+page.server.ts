import { SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { hrefs } from '$lib';
import { createClient } from '@supabase/supabase-js';
import { error, redirect, type Actions } from '@sveltejs/kit';

type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';

export async function load({ url }) {
	return { page: (url.searchParams.get('page') ?? 'profile') as CurrentPage };
}

export const actions: Actions = {
	deleteAccount: async ({ locals: { user } }) => {
		const admin = createClient(PUBLIC_SUPABASE_URL, SERVICE_ROLE);
		const { error: e } = await admin.auth.admin.deleteUser(user!.id);
		if (e) error(e.status ?? 500, { message: e.message });
		redirect(303, hrefs.home);
	}
};
