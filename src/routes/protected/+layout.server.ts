import { handleError } from '$lib';

export async function load({ locals: { supabase, user } }) {
	const { data: aircrafts, error: e } = await supabase
		.from('aircrafts')
		.select()
		.eq('owner', user!.id);
	handleError(e);
	return {
		aircrafts: aircrafts as Aircraft[]
	};
}
