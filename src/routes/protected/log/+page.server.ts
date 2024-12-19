import { error, type Actions } from '@sveltejs/kit';

export async function load({ locals: { supabase, user } }) {
	const { data: aircrafts, error: e } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', user?.id);
	if (e) error(500, { message: e.message });
	// Temporary error redirect to avoid user without aircrafts
	if (aircrafts.length == 0) error(400, { message: 'No aircrafts' });
	return { aircrafts: aircrafts as Aircraft[] };
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
	}
};
