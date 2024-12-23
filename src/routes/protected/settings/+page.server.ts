import { SERIVE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { hrefs } from '$lib';
import { createClient } from '@supabase/supabase-js';
import { error, redirect, type Actions } from '@sveltejs/kit';

type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';

export async function load({ url, locals: { supabase, user } }) {
	const aircrafts: Aircraft[] = [];
	let { data: temp } = await supabase.from('aircrafts').select().eq('owner', user?.id);
	// If temp is null, it will become an empty array
	temp = temp ?? [];
	for (let i = 0; i < temp.length; i++) aircrafts[i] = temp[i];
	return { page: (url.searchParams.get('page') ?? 'profile') as CurrentPage, aircrafts };
}

export const actions: Actions = {
	deleteAccount: async ({ locals: { user } }) => {
		const admin = createClient(PUBLIC_SUPABASE_URL, SERIVE_ROLE);
		const { error: e } = await admin.auth.admin.deleteUser(user!.id);
		if (e) error(e.status ?? 500, { message: e.message });
		redirect(303, hrefs.home);
	}
};
