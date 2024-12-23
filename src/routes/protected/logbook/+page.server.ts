import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase, user } }) {
	const { data, error: e } = await supabase.from('logs').select().eq('owner', user!.id);
	if (e) error(500, { message: e.message });
	data.forEach((item) => {
		item['dep_time'] = new Date(item['dep_time']);
		item['des_time'] = new Date(item['des_time']);
	});
	return { logs: data as Log[] };
}
