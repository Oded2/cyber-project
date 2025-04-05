import { addParams, hrefs } from '$lib';
import { error, redirect, type Actions } from '@sveltejs/kit';

export async function load({ url, locals: { supabase } }) {
	const id: string = url.searchParams.get('id') ?? '';
	let aircraft: Aircraft | undefined;
	if (id.length > 0) {
		const { data, error: e } = await supabase.from('aircrafts').select().eq('id', id);
		if (e) throw error(400, { message: e.message });
		aircraft = data ? data[0] : undefined;
	}
	return { aircraft };
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const id = url.searchParams.get('id');
		const formData = await request.formData();
		const notes = formData.get('notes') as string;
		const obj = Object.fromEntries(
			formData.entries().map(([key, value]) => {
				return [key, value.toString().length > 0 ? value.toString() : null];
			})
		);
		if (id) obj['id'] = id;
		obj['notes'] = notes.trim();
		// Upsert is a function that updates a row if a conflict is met (aircraft id for editiing), else it inserts a new row
		const { error: e } = await supabase.from('aircrafts').upsert([obj]);
		if (e) throw error(500, { message: e.message });
		throw redirect(303, addParams(hrefs.settings, { page: 'aircraft' }));
	}
};
