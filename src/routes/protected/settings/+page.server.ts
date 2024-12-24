import { SERVICE_ROLE } from '$env/static/private';
import { createSupabaseClient, hrefs } from '$lib';
import { error, redirect, type Actions } from '@sveltejs/kit';

type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';

export async function load({ url }) {
	return { page: (url.searchParams.get('page') ?? 'profile') as CurrentPage };
}

export const actions: Actions = {
	deleteAccount: async ({ locals: { user } }) => {
		const admin = createSupabaseClient(SERVICE_ROLE);
		const { error: e } = await admin.auth.admin.deleteUser(user!.id);
		if (e) error(e.status ?? 500, { message: e.message });
		redirect(303, hrefs.home);
	}
};
