import { error } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase, user } = await parent();
	const { data: aircrafts, error: e } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', user?.id);
	if (e) error(500, { message: e.message });
	// Temporary error redirect to avoid user without aircrafts
	if (aircrafts.length == 0) error(400, { message: 'No aircrafts' });
	return { aircrafts: aircrafts as Aircraft[] };
}
