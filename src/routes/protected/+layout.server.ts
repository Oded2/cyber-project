import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase, user } }) {
	const { data: aircrafts, error: e } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', user!.id);
	if (e) throw error(500, { message: e.message });
	return {
		aircrafts: aircrafts as Aircraft[]
	};
}
